import { EventEmitter } from 'events';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import moment from 'moment';
import schedule, { Job } from 'node-schedule';
import * as path from 'path';
import { DATE_DISPLAY_FORMAT } from '../utils/utils';
import { IReminder, IReminderEmbed } from './reminder.interfaces';

export class ReminderDB {

    get CachedReminders(): IReminder[] {
        return this.CACHE_REMINDERS;
    }

    get id(): number {
        return ++this.CURRENT_ID;
    }

    public reminderEvent: EventEmitter = new EventEmitter();
    private CACHE_REMINDERS: IReminder[];
    private FILE_DIR: string;
    private CURRENT_ID: number;

    constructor() {
        this.FILE_DIR = path.resolve(__dirname, '../assets/reminders.json');
        this.setCurrentId();
        this.updateCache();
        this.scheduleJobs();
    }

    /** Adds a reminder to the file. Also to the cache and creates a job for it if it has to be fired during the current hour. */
    public addReminder(reminder: IReminder): void {
        this.appendReminder(reminder);
        this.addReminderCache(reminder);
    }

    /** Removes the found reminder from the file, cache and scheduled jobs. */
    public removeReminder(userId: string, description: string): void {
        this.removeReminderFile(userId, description);
        this.removeReminderCache(userId, description);
    }

    /** Returns a list of reminders for the given user as a ReminderEmbed interface. */
    public listUserRemindersEmbed(userId: string): IReminderEmbed[] {
        const reminders: IReminder[] = this.listUserReminders(userId);
        const remindersEmbed: IReminderEmbed[] = [];
        reminders.forEach((reminder) => {
            const stringDate: string = moment(reminder.timestamp).format(DATE_DISPLAY_FORMAT);
            remindersEmbed.push({ name: reminder.description, value: `Reminder for ${stringDate}` });
        });
        return remindersEmbed;
    }

    /** Removes all the scheduled jobs. */
    public removeAllJobs() {
        for (const prop in schedule.scheduledJobs) {
            if (schedule.scheduledJobs.hasOwnProperty(prop)) {
                this.cancelJob(prop);
            }
        }
    }

    /** Updates the reminders kept on the cache with the reminders from the current hour, and creates a scheduled job for each of them. */
    private updateCache(): IReminder[] {
        this.CACHE_REMINDERS = this.readHourlyReminders() || [];
        this.createJobs(this.CACHE_REMINDERS);
        return this.CACHE_REMINDERS;
    }

    /** Adds a job that will update the cache every hour. */
    private scheduleJobs() {
        schedule.scheduleJob('0 * * * *', () => this.updateCache());
    }

    /** Lists the reminders that share the given user ID. */
    private listUserReminders(userId: string): IReminder[] {
        const reminders: IReminder[] = this.readAllReminders();
        return reminders.filter((rem) => rem.userId === userId);
    }

    /** Indicates if given reminder is from the current hour. */
    private isReminderFromHour(reminder: IReminder): boolean {
        return new Date().setMinutes(0, 0, 0) === new Date(reminder.timestamp).setMinutes(0, 0, 0);
    }

    /** Reads all the JSON file and returns the reminders found on it. */
    private readAllReminders(): IReminder[] {
        const data: string = readFileSync(this.FILE_DIR, 'utf8');
        return JSON.parse(data);
    }

    /** Returns a list of reminders obtained from the JSON file that should be fired during the current hour. */
    private readHourlyReminders(): IReminder[] {
        return this.readAllReminders().filter((reminder: IReminder) => this.isReminderFromHour(reminder));
    }

    /** Writes a list of remidners to the file, overwritting the original one. */
    private writeReminders(reminders: IReminder[]): void {
        const json: string = JSON.stringify(reminders);
        writeFileSync(this.FILE_DIR, json, 'utf8');
    }

    /** Appends a reminder to the reminder file. */
    private appendReminder(reminder: IReminder): void {
        const json: string = JSON.stringify(reminder);
        appendFileSync(this.FILE_DIR, json, 'utf8');
    }

    /** If the reminder is from the current hour, it will be added on the cache and a job for it will be created. */
    private addReminderCache(reminder: IReminder): void {
        if (this.isReminderFromHour(reminder)) {
            this.CACHE_REMINDERS.push(reminder);
            this.createJob(reminder);
        }
    }

    /** Removes the desired reminder from the cache if it exists, and also cancels the job. */
    private removeReminderCache(userId: string, description: string): void {
        const reminder: IReminder = this.CACHE_REMINDERS.find((rem) =>  rem.userId === userId && rem.description === description);
        this.CACHE_REMINDERS = this.CACHE_REMINDERS.filter((rem) => rem.userId !== userId || rem.description !== description);
        if (reminder) this.cancelJob(reminder.id.toString());
    }

    /** Gets all the reminders from the file, removes the desired one, and rewrites the whole file without that reminder. */
    private removeReminderFile(userId: string, description: string): void {
        let reminders: IReminder[] = this.readAllReminders();
        reminders = reminders.filter((rem) => rem.userId !== userId || rem.description !== description);
        this.writeReminders(reminders);
    }

    /** Creates a list of jobs based on the reminders. */
    private createJobs(reminders: IReminder[]) {
        reminders.forEach((rem) => this.createJob(rem));
    }

    /**
     * Creates a job for the date indicated on the reminder, and set the reminder ID as the unique key for the job,
     * so we can cancel it later on if necessary.
     */
    private createJob(reminder: IReminder) {
        const date: Date = new Date(reminder.timestamp);
        const job: Job = schedule.scheduleJob(reminder.id.toString(), date, () => this.jobEmits(reminder));
    }

    /** Cancels the job contained on scheduledJobs, which has the reminder ID as a key. */
    private cancelJob(id: string) {
        schedule.scheduledJobs[id]?.cancel();
    }

    /** Cancels the scheduled job and emits the reminder. */
    private jobEmits(reminder: IReminder) {
        this.cancelJob(reminder.id.toString());
        this.reminderEvent.emit('reminder', reminder);
    }

    /**
     * Initalizes the ID.
     * If there were reminders on the JSON file, it will use the next after the higher ID found.
     * If it does not find an ID on the JSON file, it will use '1' as the first ID.
     */
    private setCurrentId() {
        const reminders: IReminder[] = this.readAllReminders();
        const ids: number[] = reminders.map((rem) => rem.id);
        if (ids && ids.length > 0) {
            this.CURRENT_ID = Math.max(...ids);
        }
        if (!this.CURRENT_ID) {
            this.CURRENT_ID = 1;
        }
    }
}

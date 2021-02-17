import { EventEmitter } from 'events';
import { readFileSync, writeFileSync } from 'fs';
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

    public updateCache(): IReminder[] {
        this.CACHE_REMINDERS = this.readHourlyReminders() || [];
        this.createHourlyChronos(this.CACHE_REMINDERS);
        return this.CACHE_REMINDERS;
    }

    public writeReminder(reminder: IReminder): void {
        this.addReminderFile(reminder);
        this.addReminderCache(reminder);
    }

    public removeReminder(userId: string, description: string): void {
        this.removeReminderFile(userId, description);
        this.removeReminderCache(userId, description);
    }

    public listUserRemindersEmbed(userId: string): IReminderEmbed[] {
        const reminders: IReminder[] = this.listUserReminders(userId);
        const remindersEmbed: IReminderEmbed[] = [];
        reminders.forEach((reminder) => {
            const stringDate: string = moment(reminder.timestamp).format(DATE_DISPLAY_FORMAT);
            remindersEmbed.push({ name: reminder.description, value: `Reminder for ${stringDate}` });
        });
        return remindersEmbed;
    }

    public removeAllChronos() {
        for (const prop in schedule.scheduledJobs) {
            if (schedule.scheduledJobs.hasOwnProperty(prop)) {
                this.cancelChrono(prop);
            }
        }
    }

    private scheduleJobs() {
        schedule.scheduleJob('0 * * * *', () => this.updateCache());
    }

    private listUserReminders(userId: string): IReminder[] {
        const reminders: IReminder[] = this.readAllReminders();
        return reminders.filter((rem) => rem.userId === userId);
    }

    private isReminderFromHour(reminder: IReminder): boolean {
        return new Date().setMinutes(0, 0, 0) === new Date(reminder.timestamp).setMinutes(0, 0, 0);
    }

    private readAllReminders(): IReminder[] {
        const data: string = readFileSync(this.FILE_DIR, 'utf8');
        return JSON.parse(data);
    }

    private readHourlyReminders(): IReminder[] {
        return this.readAllReminders().filter((reminder: IReminder) => this.isReminderFromHour(reminder));
    }

    private writeReminders(reminders: IReminder[]): void {
        const json: string = JSON.stringify(reminders);
        writeFileSync(this.FILE_DIR, json, 'utf8');
    }

    private addReminderFile(reminder: IReminder): void {
        const reminders: IReminder[] = this.readAllReminders();
        reminders.push(reminder);
        this.writeReminders(reminders);
    }

    private addReminderCache(reminder: IReminder): void {
        if (this.isReminderFromHour(reminder)) {
            this.CACHE_REMINDERS.push(reminder);
            this.createDateChrono(reminder);
        }
    }

    private removeReminderCache(userId: string, description: string): void {
        const reminder: IReminder = this.CACHE_REMINDERS.find((rem) =>  rem.userId === userId && rem.description === description);
        this.CACHE_REMINDERS = this.CACHE_REMINDERS.filter((rem) => rem.userId !== userId || rem.description !== description);
        if (reminder) this.cancelChrono(reminder.id.toString());
    }

    private removeReminderFile(userId: string, description: string): void {
        let reminders: IReminder[] = this.readAllReminders();
        reminders = reminders.filter((rem) => rem.userId !== userId || rem.description !== description);
        this.writeReminders(reminders);
    }

    private createHourlyChronos(reminders: IReminder[]) {
        reminders.forEach((rem) => this.createDateChrono(rem));
    }

    private createDateChrono(reminder: IReminder) {
        const date: Date = new Date(reminder.timestamp);
        const job: Job = schedule.scheduleJob(reminder.id.toString(), date, () => this.chronoEmits(reminder));
    }

    private cancelChrono(id: string) {
        schedule.scheduledJobs[id]?.cancel();
    }

    private chronoEmits(reminder: IReminder) {
        schedule.scheduledJobs[reminder.id.toString()]?.cancel();
        this.reminderEvent.emit('reminder', reminder);
    }

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

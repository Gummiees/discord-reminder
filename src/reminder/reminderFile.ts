import { readFileSync, writeFileSync } from 'fs';
import moment from 'moment';
import schedule from 'node-schedule';
import * as path from 'path';
import { DATE_DISPLAY_FORMAT } from '../utils/utils';
import { IReminderEmbed, IReminderFile } from './interfaces';

export class ReminderFile {
    private CACHE_REMINDERS: IReminderFile[];
    private FILE_DIR: string;

    constructor() {
        this.FILE_DIR = path.resolve(__dirname, '../assets/reminders.json');
        this.updateCache();
        this.scheduleJobs();
    }

    get CachedReminders(): IReminderFile[] {
        return this.CACHE_REMINDERS;
    }

    public updateCache(): IReminderFile[] {
        this.CACHE_REMINDERS = this.readDailyReminders() || [];
        return this.CACHE_REMINDERS;
    }

    public writeReminder(reminder: IReminderFile): void {
        this.addReminderFile(reminder);
        this.addReminderCache(reminder);
    }

    public removeReminder(userId: string, description: string): void {
        this.removeReminderFile(userId, description);
        this.removeReminderCache(userId, description);
    }

    public listUserRemindersEmbed(userId: string): IReminderEmbed[] {
        const reminders: IReminderFile[] = this.listUserReminders(userId);
        const remindersEmbed: IReminderEmbed[] = [];
        reminders.forEach((reminder) => {
            const stringDate: string = moment(reminder.timestamp).format(DATE_DISPLAY_FORMAT);
            remindersEmbed.push({ name: reminder.description, value: `Reminder for ${stringDate}` });
        });
        return remindersEmbed;
    }

    private scheduleJobs() {
        schedule.scheduleJob('27 * * * *', () => this.updateCache());
    }

    private listUserReminders(userId: string): IReminderFile[] {
        const reminders: IReminderFile[] = this.readAllReminders();
        return reminders.filter((reminder) => reminder.userId === userId);
    }

    private isReminderFromToday(reminder: IReminderFile): boolean {
        return new Date().setHours(0, 0, 0, 0) === new Date(reminder.timestamp).setHours(0, 0, 0, 0);
    }

    private readAllReminders(): IReminderFile[] {
        const data: string = readFileSync(this.FILE_DIR, 'utf8');
        return JSON.parse(data);
    }

    private readDailyReminders(): IReminderFile[] {
        return this.readAllReminders().filter((reminder: IReminderFile) => this.isReminderFromToday(reminder));
    }

    private writeReminders(reminders: IReminderFile[]): void {
        const json: string = JSON.stringify(reminders);
        writeFileSync(this.FILE_DIR, json, 'utf8');
    }

    private addReminderFile(reminder: IReminderFile): void {
        const reminders: IReminderFile[] = this.readAllReminders();
        reminders.push(reminder);
        this.writeReminders(reminders);
    }

    private addReminderCache(reminder: IReminderFile): void {
        if (this.isReminderFromToday(reminder)) {
            this.CACHE_REMINDERS.push(reminder);
        }
    }

    private removeReminderCache(userId: string, description: string): void {
        this.CACHE_REMINDERS = this.CACHE_REMINDERS.filter((reminder) => reminder.userId !== userId || reminder.description !== description);
    }

    private removeReminderFile(userId: string, description: string): void {
        let reminders: IReminderFile[] = this.readAllReminders();
        reminders = reminders.filter((reminder) => reminder.userId !== userId || reminder.description !== description);
        this.writeReminders(reminders);
    }
}

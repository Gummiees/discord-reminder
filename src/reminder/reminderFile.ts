import { readFileSync, writeFileSync } from 'fs';
import moment from 'moment';
import { DATE_FORMAT } from '../utils/utils';
import { IReminderEmbed, IReminderFile } from './interfaces';

export class ReminderFile {
    private CACHE_REMINDERS: IReminderFile[];
    private FILE_DIR: string;

    constructor() {
        this.FILE_DIR = `../assets/reminders.json`;
        this.updateCache();
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
            const stringDate: string = moment(reminder.timestamp).format(DATE_FORMAT);
            remindersEmbed.push({ name: reminder.description, value: `Reminder for ${stringDate}` });
        });
        return remindersEmbed;
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

    private findReminder(reminders: IReminderFile[], userId: string, description: string): IReminderFile {
        if (!reminders) return;
        return reminders.find((reminder) => reminder.userId === userId && reminder.description === description);
    }

    private findCachedReminder(userId: string, description: string): IReminderFile {
        return this.findReminder(this.CACHE_REMINDERS, userId, description);
    }

    private removeReminderCache(userId: string, description: string): void {
        const reminder: IReminderFile = this.findCachedReminder(userId, description);
        if (reminder) {
            const index: number = this.CACHE_REMINDERS.indexOf(reminder);
            this.CACHE_REMINDERS = this.CACHE_REMINDERS.splice(index, 1);
        }
    }

    private removeReminderFile(userId: string, description: string): void {
        let reminders: IReminderFile[] = this.readAllReminders();
        const reminder: IReminderFile = this.findReminder(reminders, userId, description);
        if (reminder) {
            const index: number = reminders.indexOf(reminder);
            reminders = reminders.splice(index, 1);
            this.writeReminders(reminders);
        }
    }
}

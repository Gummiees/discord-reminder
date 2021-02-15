import { Client, Message } from 'discord.js';
import { ReminderFile } from '../reminder/reminderFile';

export abstract class Command {
    private NAME: string;

    constructor(name: string) {
        this.NAME = name;
    }

    public get name(): string {
        return this.NAME;
    }

    public abstract execute(client: Client, message: Message, reminderFile: ReminderFile, args?: string[]): Promise<Message>;
}

import { Client, Message } from 'discord.js';
import { IReminder } from '../reminder/reminder.interfaces';

export abstract class Command {
    private NAME: string;

    constructor(name: string) {
        this.NAME = name;
    }

    public get name(): string {
        return this.NAME;
    }

    public abstract execute(client: Client, message: Message, args?: string[], reminder?: IReminder): Promise<Message>;
}

import { Client, Message } from 'discord.js';

export abstract class Command {
    private NAME: string;

    constructor(name: string) {
        this.NAME = name;
    }

    public get name(): string {
        return this.NAME;
    }

    public abstract execute(client: Client, message: Message, args?: string[]): Promise<Message>;
}

import { Channel, Message } from 'discord.js';
import { MyClient } from './client/client';
import { Command } from './commands/command';
import { Config } from './config/config';
import { ReminderFile } from './reminder/reminderFile';

export class DiscordBot {
    private client: MyClient;
    private config: Config;
    private reminderFile: ReminderFile;

    constructor() {
        this.client = new MyClient();
        this.config = new Config();
        this.reminderFile = new ReminderFile();
    }

    public start(): void {
        this.client.on('ready', () => this.onReady());
        this.client.on('message', (message: Message) => this.onMessage(message));
        process.on('exit', () => this.onExit());
        this.client.login(this.config.token);
    }

    private onReady(): void {
        this.client.user.setActivity(this.config.activity);
    }

    private onMessage(message: Message): void {
        if (message.author.bot) return;
        if (message.content.indexOf(this.config.prefix) !== 0) return;

        const args: string[] = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
        const commandName: string = args.shift().toLowerCase();
        const command: Command | undefined = this.client.getCommand(commandName);
        if (!command) return this.commandNotFound(message, commandName);

        command.execute(this.client, message, this.reminderFile, args);
    }

    private onExit(): void {
        this.client.destroy();
    }

    private commandNotFound(message: Message, commandName: string): void {
        message.channel.send(`The command .${commandName} does not exist.`);
        return;
    }
}

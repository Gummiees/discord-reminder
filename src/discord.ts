import { Message } from 'discord.js';
import { MyClient } from './client/client';
import { Command } from './commands/command';
import { Config } from './config/config';

export class DiscordBot {
    private client: MyClient;
    private config: Config;

    constructor() {
        this.client = new MyClient();
        this.config = new Config();
    }

    public start(): void {
        this.client.on('ready', () => this.onReady(this));
        this.client.on('message', (message: Message) => this.onMessage(this, message));
        process.on('exit', () => this.onExit(this));
        // process.on('uncaughtException', (error: Error) => this.onException(error));
        // this.client.login(process.env.token);
        this.client.login(this.config.token);
    }

    private onReady(discordBot: DiscordBot): void {
        discordBot.client.user.setActivity(discordBot.config.activity);
    }

    private onMessage(discordBot: DiscordBot, message: Message): void {
        if (message.author.bot) return;
        if (message.content.indexOf(discordBot.config.prefix) !== 0) return;

        const args: string[] = message.content.slice(discordBot.config.prefix.length).trim().split(/ +/g);
        const commandName: string = args.shift().toLowerCase();
        const command: Command | undefined = discordBot.client.getCommand(commandName);
        if (!command) return discordBot.commandNotFound(message, commandName);

        command.execute(discordBot.client, message, args);
    }

    private onExit(discordBot: DiscordBot): void {
        discordBot.client.destroy();
    }

    private commandNotFound(message: Message, commandName: string): void {
        message.channel.send(`The command .${commandName} does not exist.`);
        return;
    }
}

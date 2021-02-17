import { Message } from 'discord.js';
import { MyClient } from './client/client';
import { Command } from './commands/command';
import { Config } from './config/config';
import { showEmbedError } from './utils/utils';

export class DiscordBot {
    private client: MyClient;
    private config: Config;

    constructor() {
        this.client = new MyClient();
        this.config = new Config();
    }

    /** Initial method to start the bot. */
    public start(): void {
        this.client.on('ready', () => this.onReady());
        this.client.on('message', (message: Message) => this.onMessage(message));
        process.on('exit', () => this.onExit());
        this.client.login(this.config.token);
    }

    /** When bot is ready, sets the activity. */
    private onReady(): void {
        this.client.user.setActivity(this.config.activity);
    }

    /** When receives a message, controls the command given to respond to it. */
    private onMessage(message: Message): Promise<Message> {
        if (message.author.bot) return;
        if (message.content.indexOf(this.config.prefix) !== 0) return;

        const args: string[] = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
        const commandName: string = args.shift().toLowerCase();
        const command: Command | undefined = this.client.getCommand(commandName);
        if (!command) return showEmbedError(message, `The command .${commandName} does not exist.`);
        return command.execute(this.client, message, args);
    }

    /** When the process exits, the client is destroyed. Note that the method has been overwritten to also cancel all the jobs. */
    private onExit(): void {
        this.client.destroy();
    }
}

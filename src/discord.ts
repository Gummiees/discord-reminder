
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
		this.client.on('ready', this.onReady);
		this.client.on('message', (message: Message) => this.onMessage(message));
		process.on('exit', this.onExit);
		// process.on('uncaughtException', (error: Error) => this.onException(error));
		this.client.login(process.env.token);

		// TODO: Set to send to specific channel if exists
	}

	private onReady(): void {
		this.client.user.setActivity(this.config.activity);
	}

	private onMessage(message: Message) {
		if (message.author.bot) { return; }
		if (message.content.indexOf(this.config.prefix) !== 0) { return; }

		const args: string[] = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
		const commandName: string = args.shift().toLowerCase();
		const command: Command = this.client.getCommand(commandName);
		if (!command) { return; }
		command.execute(this.client, message, args);
	}

	private onExit() {
		this.client.destroy();
	}
}

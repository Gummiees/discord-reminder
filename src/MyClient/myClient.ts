import { Client, ClientOptions } from 'discord.js';
import { Command } from '../commands/command';
import { List } from '../commands/list';
import { Remind } from '../commands/remind';
import { Remove } from '../commands/remove';

export class MyClient extends Client {
		private COMMANDS: Command[];

		constructor(options?: ClientOptions) {
				super(options);
				this.COMMANDS = this.createCommands();
		}

		public get commands(): Command[] {
				return this.COMMANDS;
		}

		public set commands(cmds: Command[]) {
				this.COMMANDS = cmds;
		}

		public getCommand(name: string): Command {
				this.COMMANDS.find((cmd: Command) => cmd.name === name);
		}

		private createCommands(): any {
				const remind: Command = new Remind('remind');
				const remove: Command = new Remove('remove');
				const list: Command = new List('list');
				this.COMMANDS = [remind, remove, list];
		}
}

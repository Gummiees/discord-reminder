import { Client, ClientOptions } from 'discord.js';
import { Command, Help, List, Remind, Remove } from '../commands/commands.barrel';

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

    public getCommand(name: string): Command | undefined {
        return this.COMMANDS.find((cmd: Command) => cmd.name === name);
    }

    private createCommands(): Command[] {
        const remind: Command = new Remind('remind');
        const remove: Command = new Remove('remove');
        const list: Command = new List('list');
        const help: Command = new Help('help');
        return [remind, remove, list, help];
    }
}

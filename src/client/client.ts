import { Client, ClientOptions } from 'discord.js';
import { Command, Help, List, Remind, Remove, SetChannel } from '../commands/commands.barrel';
import { MyChannel } from '../reminder/channel';

export class MyClient extends Client {
    private COMMANDS: Command[];
    private CHANNEL: MyChannel;

    constructor(options?: ClientOptions) {
        super(options);
        this.CHANNEL = new MyChannel();
        this.COMMANDS = this.createCommands();
    }

    public get commands(): Command[] {
        return this.COMMANDS;
    }

    public set commands(cmds: Command[]) {
        this.COMMANDS = cmds;
    }

    public get channel(): MyChannel {
        return this.CHANNEL;
    }

    public getCommand(name: string): Command | undefined {
        return this.COMMANDS.find((cmd: Command) => cmd.name === name);
    }

    private createCommands(): Command[] {
        const remind: Command = new Remind('remind');
        const remove: Command = new Remove('remove');
        const list: Command = new List('list');
        const help: Command = new Help('help');
        const set: Command = new SetChannel('set');
        return [remind, remove, list, help, set];
    }
}

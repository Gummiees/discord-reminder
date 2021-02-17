import { Client, ClientOptions } from 'discord.js';
import { Command, Help, List, Remind, Remove } from '../commands/commands.barrel';
import { Reminder } from '../commands/reminder';
import { IReminder } from '../reminder/reminder.interfaces';
import { ReminderDB } from '../reminder/reminderDB';

export class MyClient extends Client {
    public reminderDB: ReminderDB;
    private COMMANDS: Command[];

    constructor(options?: ClientOptions) {
        super(options);
        this.reminderDB = new ReminderDB();
        this.COMMANDS = this.createCommands();
        this.listenToReminderEmitter();
    }

    public get commands(): Command[] {
        return this.COMMANDS;
    }

    public set commands(cmds: Command[]) {
        this.COMMANDS = cmds;
    }

    public destroy(): Promise<void> {
        this.reminderDB.removeAllChronos();
        return super.destroy();
    }

    public getCommand(name: string): Command | undefined {
        return this.COMMANDS.find((cmd: Command) => cmd.name === name);
    }

    private createCommands(): Command[] {
        const remind: Remind = new Remind('remind');
        const remove: Remove = new Remove('remove');
        const list: List = new List('list');
        const help: Help = new Help('help');
        return [remind, remove, list, help];
    }

    private listenToReminderEmitter() {
        this.reminderDB.reminderEvent.on('reminder', (reminder: IReminder) => this.handleReminderEvent(reminder));
    }

    private handleReminderEvent(reminder: IReminder) {
        const reminderCommand: Reminder = new Reminder('reminder');
        reminderCommand.execute(this, null, null, reminder);
    }
}

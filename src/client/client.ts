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

    /** Overrides the original destroy method. It firstly removes all the scheduled jobs and then calls the original destroy method. */
    public destroy(): Promise<void> {
        this.reminderDB.removeAllJobs();
        return super.destroy();
    }

    public getCommand(name: string): Command | undefined {
        return this.COMMANDS.find((cmd: Command) => cmd.name === name);
    }

    /** Creates the commands and the names associated to it. */
    private createCommands(): Command[] {
        const remind: Remind = new Remind('remind');
        const remove: Remove = new Remove('remove');
        const list: List = new List('list');
        const help: Help = new Help('help');
        return [remind, remove, list, help];
    }

    /** Listens to the reminders being emitted by the scheduled jobs. */
    private listenToReminderEmitter() {
        this.reminderDB.reminderEvent.on('reminder', (reminder: IReminder) => this.handleReminderEvent(reminder));
    }

    /** Calls the reminder command, sending the reminder emitted. */
    private handleReminderEvent(reminder: IReminder) {
        const reminderCommand: Reminder = new Reminder('reminder');
        reminderCommand.execute(this, null, null, reminder);
    }
}

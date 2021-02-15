import { MyChannel } from '../reminder/channel';

export class Config {
    private PREFIX: string;
    private NAMEBOT: string;
    private ACTIVITY: string;
    private TOKEN: string;

    constructor() {
        this.PREFIX = '.';
        this.NAMEBOT = 'Reminder';
        this.ACTIVITY = '> use .remind';
        this.TOKEN = process.env.TOKEN;
    }

    public get prefix(): string {
        return this.PREFIX;
    }

    public get namebot(): string {
        return this.NAMEBOT;
    }

    public get activity(): string {
        return this.ACTIVITY;
    }

    public get token(): string {
        return this.TOKEN;
    }
}

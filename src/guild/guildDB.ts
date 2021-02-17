import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { IGuild } from './guild.interfaces';

export class GuildDB {
    get id(): string {
        return this.GUILD?.id;
    }

    set id(guildId: string) {
        this.GUILD = { id: guildId };
        this.writeGuild(this.GUILD);
    }

    private FILE_DIR: string;
    private GUILD: IGuild;

    constructor() {
        this.FILE_DIR = path.resolve(__dirname, '../assets/guild.json');
        this.readGuild();
    }

    private readGuild(): IGuild {
        const data: string = readFileSync(this.FILE_DIR, 'utf8');
        return JSON.parse(data);
    }

    private writeGuild(guild: IGuild): void {
        const json: string = JSON.stringify(guild);
        writeFileSync(this.FILE_DIR, json, 'utf8');
    }
}

import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

export class MyChannel {
    private FILE_DIR: string;

    constructor() {
        this.FILE_DIR = path.resolve(__dirname, '../assets/channel.json');
    }

    public get id(): string {
        const data: string = readFileSync(this.FILE_DIR, 'utf8');
        return JSON.parse(data);
    }

    public set id(idSet: string) {
        const json: string = JSON.stringify(idSet);
        writeFileSync(this.FILE_DIR, json, 'utf8');
    }
}

import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import moment from 'moment';

export const DATE_FORMAT: string = 'YYYYMMDDHHmm';
export const DATE_DISPLAY_FORMAT: string = 'HH:mm DD/MM/YYYY';
export const DATE_FORMAT_REFEX: RegExp = /\d\d\d\d/g;

export function showEmbedError(message: Message, description: string): Promise<Message> {
    const options: RichEmbedOptions = {
        title: 'Error',
        color: 15158332,
        description,
    };
    const embed: RichEmbed = new RichEmbed(options);
    return message.channel.send(embed);
}

/** Comprueba si el valor es de tipo Date. */
export function isDateType(value: any): boolean {
    const d: Date = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
}

export function isDateFormatCorrect(stringDate: string): boolean {
    const date: any = moment(stringDate, DATE_FORMAT);
    return isDateType(date);
}

export function isTimeFuture(timestamp: number) {
    return new Date() < new Date(timestamp);
}

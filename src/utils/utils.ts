import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import moment from 'moment';

export const DATE_FORMAT: string = 'YYYYMMDDHHmm';
export const DATE_DISPLAY_FORMAT: string = 'HH:mm DD/MM/YYYY';

/** Writes an embed to the channel the message was sent, with the given error description. */
export function showEmbedError(message: Message, description: string): Promise<Message> {
    const options: RichEmbedOptions = {
        title: 'Error',
        color: 15158332,
        description,
    };
    const embed: RichEmbed = new RichEmbed(options);
    return message.channel.send(embed);
}

/** Checks if the value is a date type. */
export function isDateType(value: any): boolean {
    const d: Date = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
}

/** Checks if the date format is correct. */
export function isDateFormatCorrect(stringDate: string): boolean {
    const date: any = moment(stringDate, DATE_FORMAT);
    return isDateType(date);
}

/** Checks if the given timestamp is a timestamp for the future. */
export function isTimeFuture(timestamp: number) {
    return new Date() < new Date(timestamp);
}

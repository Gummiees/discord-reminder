import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import moment from 'moment';

export const DATE_FORMAT: string = 'hh:mm DD/MM/YYYY';

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

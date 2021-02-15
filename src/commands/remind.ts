import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import moment from 'moment';
import { IReminderFile } from '../reminder/interfaces';
import { ReminderFile } from '../reminder/reminderFile';
import { DATE_FORMAT, isDateFormatCorrect, showEmbedError } from '../utils/utils';
import { Command } from './command';

export class Remind extends Command {
    public async execute(client: Client, message: Message, reminderFile: ReminderFile, args: string[]): Promise<Message> {
        if (!args || args.length !== 2) return showEmbedError(message, 'You need to specify the description and timestamp.');
        if (!isDateFormatCorrect(args[1])) return showEmbedError(message, `The timestamp format is not correct. It must be ${DATE_FORMAT} `);

        const reminder: IReminderFile = {
            userId: message.author.toString(),
            description: args[0],
            timestamp: moment(args[1], DATE_FORMAT).unix(),
        };

        reminderFile.writeReminder(reminder);

        const options: RichEmbedOptions = {
            title: 'New reminder created',
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL,
            },
            color: 3066993,
            description: reminder.description,
            footer: {
                text: 'Will remind at',
            },
            timestamp: new Date(reminder.timestamp),
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

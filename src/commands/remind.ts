import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import moment from 'moment';
import { MyClient } from '../client/client';
import { IReminder } from '../reminder/reminder.interfaces';
import { DATE_FORMAT, isDateFormatCorrect, isTimeFuture, showEmbedError } from '../utils/utils';
import { Command } from './command';

export class Remind extends Command {
    public async execute(client: MyClient, message: Message, args: string[]): Promise<Message> {
        if (!args || args.length !== 2) return showEmbedError(message, 'You need to specify the description and timestamp.');
        if (!isDateFormatCorrect(args[1])) return showEmbedError(message, `The timestamp format is not correct. It must be ${DATE_FORMAT}.`);
        const timestamp: number = +moment(args[1], DATE_FORMAT).toDate();
        if (!isTimeFuture(timestamp)) return showEmbedError(message, `The reminder must be set on a point in the future.`);

        const reminder: IReminder = {
            channelId: message.channel.id,
            guildId: message.guild.id,
            guildMemberId: message.guild.member(message.author.id)?.id,
            userId: message.author.toString(),
            description: args[0],
            timestamp,
            id: client.reminderDB.id
        };

        client.reminderDB.writeReminder(reminder);

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

import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { IReminderEmbed } from '../reminder/interfaces';
import { ReminderFile } from '../reminder/reminderFile';
import { Command } from './command';

export class List extends Command {
    public async execute(client: Client, message: Message, reminderFile: ReminderFile, args: string[]): Promise<Message> {
        const reminders: IReminderEmbed[] = reminderFile.listUserRemindersEmbed(message.author.toString());
        const options: RichEmbedOptions = {
            title: 'Your reminders',
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL,
            },
            color: 3447003,
            fields: reminders,
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

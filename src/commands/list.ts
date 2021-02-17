import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { MyClient } from '../client/client';
import { IReminderEmbed } from '../reminder/reminder.interfaces';
import { Command } from './command';

export class List extends Command {
    public async execute(client: MyClient, message: Message): Promise<Message> {
        const reminders: IReminderEmbed[] = client.reminderDB.listUserRemindersEmbed(message.author.toString());
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

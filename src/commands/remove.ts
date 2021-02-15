import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { ReminderFile } from '../reminder/reminderFile';
import { showEmbedError } from '../utils/utils';
import { Command } from './command';

export class Remove extends Command {
    public execute(client: Client, message: Message, reminderFile: ReminderFile, args: string[]): Promise<Message> {
        if (!args || args.length !== 1) return showEmbedError(message, 'You need to specify the reminder to remove.');
        const reminderDescription: string = args[0];
        reminderFile.removeReminder(message.author.toString(), reminderDescription);
        const options: RichEmbedOptions = {
            title: 'Reminder removed',
            color: 3066993,
            description: `The reminder '${reminderDescription}' was removed successfully.`,
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

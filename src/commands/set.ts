import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { MyClient } from '../client/client';
import { ReminderFile } from '../reminder/reminderFile';
import { Command } from './command';

export class SetChannel extends Command {
    public async execute(client: MyClient, message: Message, reminderFile: ReminderFile, args: string[]): Promise<Message> {
        client.channel.id = message.channel.id;
        const options: RichEmbedOptions = {
            title: 'Channel set',
            description: `The channel to communicate reminders and errors has been set to '${message.channel.id}'.`,
            color: 3066993,
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

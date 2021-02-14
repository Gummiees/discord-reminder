import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { ShowEmbedError } from '../utils/utils';
import { Command } from './command';

export class Remove extends Command {
    public execute(client: Client, message: Message, args: string[]): Promise<Message> {
        if (!args || args.length !== 1) return ShowEmbedError(message, 'You need to specify the reminder to remove.');
        // TODO: Remove reminder
        const options: RichEmbedOptions = {
            title: 'Reminder removed',
            color: 3066993,
            description: `The reminder '${args[0]}' was removed successfully.`,
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { Command } from './command';

export class Remind extends Command {
    public async execute(client: Client, message: Message, args: string[]): Promise<Message> {
        // TODO: Create reminder
        const options: RichEmbedOptions = {
            title: 'New reminder created',
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL,
            },
            color: 3066993,
            description: 'Reminder description',
            footer: {
                text: 'Will remind at',
            },
            timestamp: new Date(),
        };
        const embed: RichEmbed = new RichEmbed(options);
        return message.channel.send(embed);
    }
}

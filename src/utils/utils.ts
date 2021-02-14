import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';

export function ShowEmbedError(message: Message, description: string): Promise<Message> {
    const options: RichEmbedOptions = {
        title: 'Error',
        color: 15158332,
        description,
    };
    const embed: RichEmbed = new RichEmbed(options);
    return message.channel.send(embed);
}

import { Client, Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import { Command } from './command';

export class Remove extends Command {

	public async execute(client: Client, message: Message, args: string[]): Promise<void> {
		const options: RichEmbedOptions = {
			title: 'Title',
			author: {
				name: 'Author',
				icon_url: message.author.displayAvatarURL
			},
			color: '#000000',
			description: 'Description',
			footer: {
				text: 'Footer'
			},
			timestamp: new Date()
		};
		const embed: RichEmbed = new RichEmbed(options);
		message.channel.send(embed);
	}
}

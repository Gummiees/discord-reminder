import { Guild, GuildMember, Message, RichEmbed, RichEmbedOptions, User } from 'discord.js';
import { MyClient } from '../client/client';
import { IReminder } from '../reminder/reminder.interfaces';
import { showEmbedError } from '../utils/utils';
import { Command } from './command';

export class Reminder extends Command {
    public async execute(client: MyClient, message: Message, args?: string[], reminder?: IReminder): Promise<Message> {
        const guild: Guild = client.guilds.get(reminder.guildId);
        if (!guild) return;
        const channel: any = guild.channels.get(reminder.channelId);
        if (!channel)  return showEmbedError(message, `Could not find the channel where the original reminder was send.`);
        const guildMember: GuildMember = guild.member(reminder.guildMemberId);
        if (!guildMember) return showEmbedError(message, `Could not find the user that set the reminder in the server.`);
        const user: User = guildMember.user;
        if (!user) return showEmbedError(message, `Could not find the user that set the reminder in the server.`);

        const options: RichEmbedOptions = {
            title: reminder.description,
            author: {
                name: user.username,
                icon_url: user.displayAvatarURL,
            },
            description: 'Reminder',
            color: 3447003,
            timestamp: new Date(reminder.timestamp),
        };
        const embed: RichEmbed = new RichEmbed(options);
        channel.send(`${reminder.userId}`);
        return channel.send(embed);
    }
}

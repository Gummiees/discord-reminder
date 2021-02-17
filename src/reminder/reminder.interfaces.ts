export interface IReminder {
    guildId: string;
    channelId: string;
    guildMemberId: string;
    userId: string;
    description: string;
    timestamp: number;
    id: number;
}

export interface IReminderEmbed {
    name: string;
    value: string;
}

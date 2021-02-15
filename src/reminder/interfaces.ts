export interface IReminderFile {
    userId: string;
    description: string;
    timestamp: number;
}

export interface IReminderEmbed {
    name: string;
    value: string;
}

// export interface IReminderCache extends IReminderFile {
//     userId: number;
//     description: string;
//     timestamp: number;
//     saved: boolean;
// }

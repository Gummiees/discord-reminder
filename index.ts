import * as dotenv from 'dotenv';
import { DiscordBot } from './src/discord';

dotenv.config();
const bot: DiscordBot = new DiscordBot();
bot.start();

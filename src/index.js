import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { chatGPT } from './chatgpt.js';
import { tokens } from './tokens.js';

config();

const token = process.env.TOKEN;
const bot = new Telegraf(token, { handlerTimeout: Infinity });

bot.command('start', (ctx) => {
  ctx.reply('Привет! Напиши мне что хочешь');
});

bot.command('tokens', async (ctx) => {
  await tokens();
});

bot.on(message('text'), async (ctx) => {
  const gptResponse = await chatGPT(ctx.message.text);

  ctx.reply(gptResponse || 'Извините, я не понял ваш запрос.');
});

bot.launch();
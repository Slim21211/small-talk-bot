import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { chatGPT } from './chatgpt.js';

config();

const token = process.env.TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const bot = new Telegraf(token, { handlerTimeout: Infinity });

bot.command('start', (ctx) => {
  ctx.reply('Привет! Напиши мне что хочешь');
});

bot.on(message('text'), async (ctx) => {
  try {
    await ctx.sendChatAction('typing');

    const { text, error, raw } = await chatGPT(ctx.message.text, ctx.from.id);

    if (text) {
      await ctx.reply(text);
    } else {
      await ctx.reply('Что-то пошло не так. Попробуйте снова позже.');

      const fullDump = JSON.stringify(raw, null, 2).slice(0, 4000);

      await ctx.telegram.sendMessage(
        ADMIN_ID,
        `Ошибка у пользователя @${ctx.from.username || ctx.from.id}:\n\n${error}\n\nПолный ответ:\n${fullDump}`
      );
    }
  } catch (e) {
    await ctx.reply('Что-то пошло совсем не так...');
    await ctx.telegram.sendMessage(ADMIN_ID, `Критическая ошибка: ${e.message}`);
  }
});

bot.launch();
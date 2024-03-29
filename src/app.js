dotenv.config();
import { logger, prisma } from "./index.js";
import * as dotenv from 'dotenv'
import { Telegraf, Scenes, session } from 'telegraf';
import asyncWrapper from "./util/error-handler.js";
import { getMainKeyboard } from "./util/keyboard.js";
import startScene from './controllers/start/index.js';
import documentScene from './controllers/ticket/index.js';


const bot = new Telegraf('');

const stage = new Scenes.Stage([
    startScene,
    documentScene
]);
bot.use(session());
bot.use(stage.middleware());

const { mainKeyboard, mainKeyboardDocument  } = getMainKeyboard();

bot.command('repair', async (ctx) => {
    logger.info(`User ${ctx.message.from.id} used /repair command`);
    await ctx.reply('✋ Ну привет! Чем могу помочь?', mainKeyboard);
})

bot.start(asyncWrapper(async (ctx) => ctx.scene.enter('start')));

bot.hears(
    mainKeyboardDocument,
    asyncWrapper(async (ctx) => ctx.scene.enter('document'))
);

bot.hears(
    mainKeyboardDocument,
    asyncWrapper(async (ctx) => ctx.scene.enter('document'))
);



bot.launch().catch(e => {
    logger.error(e)
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


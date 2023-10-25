import {Scenes, session, Composer, Markup} from "telegraf";
import { logger, prisma } from "../../index.js";

import { sleep } from "../../util/common.js";
import { getMainKeyboard, getLestGoKeyboardInline } from '../../util/keyboard.js'

const WizardScene = Scenes.WizardScene;

const { letsGoKeyboard } = getLestGoKeyboardInline();

const start = new WizardScene('start',
    async (ctx) => {
        const uid = ctx.message.from.id;
        const userId = await prisma.users.findUnique({ where:{ uid: uid } });
        const { mainKeyboard } = getMainKeyboard();
        const { letsGoKeyboard } = getLestGoKeyboardInline();

        //TODO:Сделать проверку на бан в updateUserLastTimestamps или разделить методы, если пользователь
        // заблокирован, отбивать его вход.
        if (userId) {
            await ctx.reply(`С возвращением! Теперь ты снова можешь найти необходимые файлы! Чем я могу тебе помочь?`, mainKeyboard);
            logger.info(`User with id:${uid} successfully connected`);
            await ctx.scene.leave();
        }
        else {
            await prisma.users.create({
                data: {
                    uid: ctx.message.from.id,
                    username: ctx.message.from.username,
                    first_name: ctx.message.from.first_name,
                    last_name: ctx.message.from.last_name,
                    roles: 1,
                    organizations: 1,
                    last_activity: new Date(),
                    is_banned: true
                }
            });
            logger.debug('New user load : %d', ctx.message.from.id);
            await ctx.scene.leave();
        }
        //TODO: Если пользователя нет, то добавляем и ставим значение isBanned = true
    }
);

start.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard();
    await ctx.reply('✋ Ну привет! Чем могу помочь?', mainKeyboard);
});

start.action(/lets_go/, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
});

export default start;

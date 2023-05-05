import {Scenes, session, Composer, Markup} from "telegraf";
import { logger, prisma } from "../../index.js";

import { sleep } from "../../util/common.js";
import { getMainKeyboard, getLestGoKeyboardInline } from '../../util/keyboard.js'

import emailValidator from "../../util/emailValidator.js";
import emailSender from "../../util/emailSender.js";

const WizardScene = Scenes.WizardScene;

const generateCode = () => {
    return Math.floor(Math.random() * 10000);
};

const { letsGoKeyboard } = getLestGoKeyboardInline();

const messageCode = (email, emailCode) => {
    return {
        from: '"Привет, Андрей" <onezxro@yandex.ru>',
        to: email,
        subject: 'Код подтверждения для чат-бота "Привет, Андрей"',
        html: `
                    <h2>Ваш код подтверждения : ${emailCode}</h2>
                    `
    }
};

const start = new WizardScene('start',
    async (ctx) => {
        const uid = ctx.message.from.id;
        const userId = await prisma.users.findUnique({ where:{ uid: uid } });
        const { mainKeyboard } = getMainKeyboard();
        const { letsGoKeyboard } = getLestGoKeyboardInline();

        if (userId) {
            await ctx.reply(`С возвращением! Теперь ты снова можешь найти необходимые файлы! Чем я могу тебе помочь?`, mainKeyboard);
            logger.info(`User with id:${uid} successfully connected`);
            await ctx.scene.leave();
        } else {
            await ctx.reply(`🧐 Хм.. Видимо я не нашел тебя в списках пользователей!`);
            await sleep(2);
            await ctx.reply(`Для работы со мной ты должен пройти небольшую регистрацию!😊\n`);
            await ctx.reply(`✉️ Напиши свой email-адрес и я вышлю тебе код для авторизации.\n❗️ Учитывай, что я не принимаю доменные адреса не входящие в состав компании`);
            return ctx.wizard.next();
        }
    },
      async (ctx) => {
        ctx.wizard.state.email = ctx.message.text;
        const email = ctx.wizard.state.email
        const emailValidate = emailValidator(email);
        console.log(emailValidate);
        if (emailValidate) {
            ctx.wizard.state.emailCode = generateCode();
            const emailMessage = messageCode(ctx.wizard.state.email,ctx.wizard.state.emailCode)
            const sendEmailCode= await emailSender(emailMessage);
            console.log(sendEmailCode);
            if (sendEmailCode) {
                await ctx.reply(`Отлично! Как только ты получишь код подтверждения на свою почту, напиши мне его`, Markup.inlineKeyboard(
                    [
                        Markup.button.callback('Отправить код повторно', 'resend_code'),
                        Markup.button.callback('Изменить email адрес', 'change_email')
                    ]
                ));
                return ctx.wizard.next();
            } else {
                await ctx.reply(`Ой! Не удалось отправить код для подтверждения...`);
            }
        } else {
            await ctx.reply('Email неверный')
        }
    },
     async (ctx) => {
        if (ctx.wizard.state.emailCode === parseInt(ctx.message.text)) {
            await prisma.users.create({
                data: {
                    uid: ctx.message.from.id,
                    username: ctx.message.from.username,
                    first_name: ctx.message.from.first_name,
                    last_name: ctx.message.from.last_name,
                    roles: 1,
                    email: ctx.wizard.state.email,
                    isverified: false,
                    last_activity: new Date(),
                }
            });
            logger.debug('New user load : %d', ctx.message.from.id);
            await ctx.reply(`Аккаунт создан успешно! Перед началом работы, рекомендую тебе прочитать небольшую инструкцию о том, кто я такая и как со мной работать 😊`);
            await sleep(3);
            await ctx.reply('Меня зовут Docflow Bot, я помогу тебе найти необходимые документы в моей базе знаний. С помощью поиска найди интресующий тебя документ и скачай его на свое устройство.\n\n❗️ Управлять мною можно с помощью Телеграмм-клавиатуры. Чтобы открыть ее, нажми на иконку в правом нижнем углу\n\n❗️ Если что-то сломалось, напиши мне /repair и я попытаюсь все починить\n\n❗️ Больше информации про меня ты сможешь найти в секции ❓ Обо мне\n\n',
                letsGoKeyboard
            );
            return ctx.wizard.next();
        } else {
            await ctx.reply(`Код указан неверно! Попробуй еще раз.`);
            console.log('Код указан не верно ');
        }
    },
);

start.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard();
    await ctx.reply('✋ Ну привет! Чем могу помочь?', mainKeyboard);
});

start.action(/resend_code/, async (ctx) => {
    await ctx.answerCbQuery();
    const repairEmailMessage = messageCode(ctx.wizard.state.email,ctx.wizard.state.emailCode)
    const repairSendEmailCode= await emailSender(repairEmailMessage);
    if (repairSendEmailCode) {
        await ctx.reply('Отправил код повторно на твою почту.');
    } else {
        await ctx.reply(`Ой! Не удалось отправить код для подтверждения...`);
    }

});

start.action(/lets_go/, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
});

export default start;

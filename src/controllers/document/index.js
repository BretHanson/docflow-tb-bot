import {Markup, Scenes} from "telegraf";
import { logger, prisma } from "../../index.js";
import Fuse from "fuse.js";

import { sleep } from "../../util/common.js";
import { updateUserLastTimestamp } from "../../middlewares/updateUserLastTimestamps.js";
import {getMainKeyboard, getDocumentKeyboard, getBackKeyboard} from '../../util/keyboard.js'

const Base = Scenes.BaseScene;
const document = new Base("document");
const { leave } = Scenes.Stage;

const {
    backKeyboard,
    backKeyboardBack
      } = getBackKeyboard();

/*const optionSearch = {
    includeScore: true,
    keys: ['name']
};*/

/*const documents = await prisma.documents.findMany();*/

/*const fuse = new Fuse(documents, optionSearch);*/

document.enter(async (ctx) => {
    logger.info(`User ${ctx.message.from.id} enter document scene`);
    await updateUserLastTimestamp(ctx);
    await ctx.replyWithHTML(`👀 Отправь мне название документа и я попробую его найти \n ️ Название должно быть более 3-х символов`, backKeyboard);
});

document.leave(async (ctx) => {
    logger.info(`User ${ctx.message.from.id} leave document scene`);
    const { mainKeyboard } = getMainKeyboard();
    await ctx.reply('✋ Ну привет! Чем могу помочь?', mainKeyboard);
});

document.command('repair', leave());
document.hears(backKeyboardBack, leave());

document.on("message", async (ctx) => {
    logger.info(`Search document name: ${ctx.message.text}`);
    if (ctx.message.text === backKeyboardBack) { leave() };
    if(ctx.message.text.length < 3){
        await ctx.telegram.sendMessage(ctx.message.chat.id,
            `Минимальное количество символов при поиске должно быть более 3 🗿`);
    }else {
        const searchResult = fuse.search(String(ctx.message.text));
        if (searchResult.length > 0) {
            await ctx.telegram.sendMessage(ctx.message.chat.id, '🧷 Вот что мне удалось найти в базе знаний', Markup.inlineKeyboard(
                searchResult.map((item) => {
                    return [Markup.button.callback(item.item.name, item.item.id)]
                })
        ))
        } else {
            await ctx.telegram.sendMessage(ctx.message.chat.id, '🧐 Ничего не нашел по вашему запросу');
            logger.info(`Document ${ctx.message.text} not found`);
        }
    }
});

document.command('repair', leave());
document.hears(backKeyboardBack, leave());
export default document;

import { logger } from "../index.js";
/**
* Обертка для перехвата ошибок async внутри сцен.
*/
const asyncWrapper = (fn) => {
    return async function (ctx, next) {
        try {
            return await fn(ctx)
        } catch (err) {
            logger.error(`${ctx}\nasyncWrapper error:${err}`);
            await ctx.reply('❌Ой.. Видимо, что-то пошло не так.. Попробуй еще раз!');
            return next();
        }
    };
};

export default asyncWrapper;

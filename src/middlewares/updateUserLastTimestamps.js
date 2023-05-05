import { logger, prisma } from "../index.js";

export const updateUserLastTimestamp = async (ctx, next) => {
  try {
      await prisma.users.update({
          data: { last_activity: new Date() },
          where: { uid: ctx.message.from.id },
      });
      logger.debug('Update last activity for user: %d', ctx.message.from.id);

      return next;
  } catch (e) {
    logger.debug(e)
  }
};

import prismaPackage from '@prisma/client';
import pino from 'pino';

const loggerPino = pino({
    level: "debug",
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        }
    }
});

export const logger = loggerPino;
export const prisma = new prismaPackage.PrismaClient();


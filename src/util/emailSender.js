import { logger } from "../index.js";
import nodemailer from 'nodemailer';
import {Markup} from "telegraf";
import {message} from "telegraf/filters";

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: "onezxro@yandex.ru",
        pass: "ltmhyiyqxirbljln",
    }
});

const sendMailerCode = async (message) => {
    try {
        await transporter.sendMail(message);
        logger.info('ok');
        return true;
    } catch (err) {
        logger.error(err);
        return false;
    }
}

export default sendMailerCode;

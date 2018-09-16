"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Telegram = require("node-telegram-bot-api");
const log4js = require("log4js");
const config_1 = require("./config");
const modules_1 = require("./modules");
const logger = log4js.getLogger();
try {
    if (config_1.config.dev === false) {
        logger.level = 'INFO';
        process.env.NODE_ENV = 'production';
    }
    else if (config_1.config.dev === true) {
        logger.level = 'DEBUG';
        process.env.NODE_ENV = 'development';
    }
    else {
        logger.level = 'ALL';
        process.env.NODE_ENV = 'development';
    }
    logger.info('Welcome to telegram bot!');
    logger.debug('Debug Mode!');
    const bot = new Telegram(config_1.config.apiKey.telegram, { polling: true });
    logger.info('Bot is activated!');
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            config_1.config.bot = yield bot.getMe();
            const loadModules = {};
            for (let key in modules_1.default) {
                loadModules[key] = new modules_1.default[key](bot, logger, config_1.config);
                loadModules[key].run();
                logger.debug('module ' + key + 'successfuly load');
            }
            logger.info('Ready!');
        }
        catch (err) {
            logger.error(err);
            process.exit(0);
        }
    }))();
}
catch (err) {
    console.error(err);
}

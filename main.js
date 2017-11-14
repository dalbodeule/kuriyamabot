"use strict";
const telegram = require('node-telegram-bot-api'), dateformat = require('dateformat'),
    readline = require('readline'), log4js = require('log4js'),
    helper = require('./src/helper'), logger = log4js.getLogger();

global.config = require('./config.json');

if(global.config.dev == false) {
    logger.level = 'INFO';
    process.env.NODE_ENV = 'production';
} else if(global.config.dev == true) {
    logger.level = 'DEBUG';
    process.env.NODE_ENV = 'development';
} else {
    logger.level = 'ALL';
    process.env.NODE_ENV = 'development';
}

logger.info('Welcome to telegram bot!');
logger.debug('Debug Mode!');

const bot = new telegram(global.config.apiKey, {polling: true});

logger.info('Bot is activated!');

(async() => {
    try {
        let res = await bot.getMe();
        global.botinfo = res;
        const module_loader = require('./src/modules')(bot, logger, helper);
        
        logger.info('Ready!');
    } catch(e) {
        logger.error(e);
    }
})();
"use strict";
const telegram = require('node-telegram-bot-api'), dateformat = require('dateformat'),
    readline = require('readline'), log4js = require('log4js'),
    async = require('async'), modules = require('./src/modules'),
    logger = log4js.getLogger();

global.config = require('./config.json');

if(global.config.dev == false) {
	logger.setLevel('INFO');
} else if(global.config.dev == true) {
	logger.setLevel('DEBUG');
} else {
	logger.setLevel('ALL');
}

logger.info('Welcome to telegram bot!');
logger.debug('Debug Mode!');

const bot = new telegram(global.config.apiKey, {polling: true});

logger.info('Bot is activated!');

(async() => {
    try {
        let res = await bot.getMe();
        global.botinfo = res;
        const command_module = require('./src/command')(bot, logger, modules);
        const message_module = require('./src/message')(bot, logger, modules);
        const inline_module = require('./src/inline')(bot, logger, modules);
        const callback_module = require('./src/callback')(bot, logger, modules);
        
        logger.info('Ready!');
    } catch(e) {
        logger.error(e);
    }
})();
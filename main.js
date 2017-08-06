"use strict";
const telegram = require('node-telegram-bot-api'), dateformat = require('dateformat'),
    readline = require('readline'), log4js = require('log4js'),
    modules = require('./src/modules'), logger = log4js.getLogger();

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
        const module_command = require('./src/module_command')(bot, logger, modules);
        const module_message = require('./src/module_message')(bot, logger, modules);
        const module_inline = require('./src/module_inline')(bot, logger, modules);
        const module_callback = require('./src/module_callback')(bot, logger, modules);
        
        logger.info('Ready!');
    } catch(e) {
        logger.error(e);
    }
})();
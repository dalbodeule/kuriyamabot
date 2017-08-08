"use strict";
module.exports = (bot, logger, modules) => {
    const answer = (msg, temp) => {
        bot.answerCallbackQuery(msg.id, temp.group('command.help.twice'));
    }
    
    bot.on('callback_query', async (msg) => {
        const callid = msg.id;
        let temp;
        try {
            temp = await modules.getlang(msg, logger);
            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: callback received');
            if(msg.data == 'help_image') {
                require('./help_image.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help') {
                require('./help_help.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help_search') {
                require('./help_search.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help_start') {
                require('./help_start.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help_uptime') {
                require('./help_uptime.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help_lang') {
                require('./help_lang.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'help_me') {
                require('./help_me.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'changelang_ko') {
                require('./changeLang_ko.js')(bot, logger, modules, msg, callid, temp, answer);
            } else if(msg.data == 'changelang_en') {
                require('./changeLang_en.js')(bot, logger, modules, msg, callid, temp, answer);
            }
        } catch(e) {
            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
            logger.debug(e.message);
        }
    });
}
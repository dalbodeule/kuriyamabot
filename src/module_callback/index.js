"use strict";
module.exports = (bot, logger, modules) => {
    const answer = (msg, temp) => {
        bot.answerCallbackQuery(msg.id, temp.group('command.help.twice'));
    }
    
    bot.on('callback_query', async (msg) => {
        const callid = msg.id;
        let temp;
        try {
            let chatAction;
            [temp, chatAction] = await Promise.all([
                modules.getlang(msg, logger),
                bot.sendChatAction(msg.message.chat.id, 'typing')
            ]);
            let regex = msg.data.match(/changelang_([a-zA-Z]{2})/);
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
            } else if(regex != null) {
                require('./changeLang.js')(bot, logger, modules, msg, callid, temp, answer, regex);
            }
        } catch(e) {
            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
            logger.debug(e.message);
        }
    });
}
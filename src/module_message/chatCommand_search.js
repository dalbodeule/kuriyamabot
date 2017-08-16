"use strict";

module.exports = async(bot, logger, modules, msg, tcom) => {
    const chatid = msg.chat.id, searchModule = require('../modules/search.js');
    let temp;
    try{
        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: chat command received');
        let res;
        [temp, res] = await Promise.all([
            modules.getlang(msg, logger),
            searchModule.search(msg.text),
            bot.sendChatAction(chatid, 'typing')
        ]);
        if(res == '') {
            bot.sendMessage(chatid, temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: not found');
        } else {
            try {
                await Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    bot.sendMessage(chatid, res, {parse_mode: 'HTML', disable_web_page_preview: true, reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [[{
                                text: temp.inline('command.search.another'),
                                url: 'https://www.google.com/search?q='+encodeURIComponent(tcom[2])+'&ie=UTF-8'
                            },{
                                text: temp.inline('command.img.another'),
                                switch_inline_query_current_chat: 'img '+tcom[2]
                            }]]
                        }})
                    ]);
                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: search success');
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error');
                logger.debug(e.stack);
                try {
                    await Promise.all([
                        bot.sendChatAction(chatid, 'typing'),
                        bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                            .replace([/{botid}/g], global.botinfo.username).replace(/{keyword}/g, tcom[2]), {reply_markup:{ inline_keyboard: [[{
                            text: '@'+global.botinfo.username+' search '+tcom[2],
                            switch_inline_query_current_chat: 'search '+tcom[2]
                        }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'})
                    ]);
                } catch(e) {
                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error send error');
                    logger.debug(e.stack);
                }
            }
        }
    } catch(e) {
        logger.error('chatid: '+chatid+', chat command: '+tcom[0]+', type: valid, response: search error');
        logger.debug(e.stack);
        try {
            await Promise.all([
                bot.sendChatAction(chatid, 'typing'),
                bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, tcom[2]), {reply_markup:{ inline_keyboard: [[{
                    text: '@'+global.botinfo.username+' search '+tcom[2],
                    switch_inline_query_current_chat: 'search '+tcom[2]
                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'})
            ]);
        } catch(e) {
            logger.error('chatid: '+chatid+', chat command: '+tcom[0]+', type: valid, response: search error send error');
            logger.debug(e.stack);
        }
    }
}
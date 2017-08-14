"use strict";

module.exports = async(bot, logger, modules, msg) => {
    const chatid = msg.chat.id, searchModule = require('../modules/search.js');
    let temp;
    try{
        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
        let response;
        [temp, response] = await Promise.all([
            modules.getlang(msg, logger),
            searchModule.search(msg.text),
            bot.sendChatAction(chatid, 'upload_photo')
        ]);
        if(response == '') {
            await Promise.all([
                bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id}),
                bot.sendChatAction(chatid, 'typing')
            ]);
            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: not found');
        } else {
            try {
                await Promise.all([
                    bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
                        "\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [[{
                                text: temp.inline('command.search.another'),
                                url: 'https://www.google.com/search?q='+encodeURIComponent(msg.text)+'&ie=UTF-8'
                            }]]
                    }}),
                    bot.sendChatAction(chatid, 'typing')
                ]);
                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: search success');
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                logger.debug(e.stack)
                try {
                    await Promise.all([
                        bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                            .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text), {reply_markup:{ inline_keyboard: [[{
                                text: '@'+global.botinfo.username+' search '+msg.text,
                                switch_inline_query_current_chat: 'search '+msg.text
                            }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'}),
                        bot.sendChatAction(chatid, 'typing')
                    ]);
                } catch(e) {
                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                    logger.debug(e.stack);
                }
            }
        }
    } catch(e) {
        logger.error('chatid: '+chatid+', command: '+msg.text+', type: valid, response: search error');
        logger.debug(e.stack);
        try {
            await Promise.all([
                bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                    .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text), {reply_markup:{ inline_keyboard: [[{
                        text: '@'+global.botinfo.username+' search '+msg.text,
                        switch_inline_query_current_chat: 'search '+msg.text
                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'}),
                bot.sendChatAction(chatid, 'typing')
            ]);
        } catch(e) {
            logger.error('chatid: '+chatid+', command: '+msg.text+', type: valid, response: search error send error');
            logger.debug(e.stack);
        }
    }
}
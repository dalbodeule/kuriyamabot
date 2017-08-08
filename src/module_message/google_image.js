"use strict";

module.exports = async(bot, logger, modules, msg) => {
    const chatid = msg.chat.id, searchModule = require('../modules/search.js');
    let temp;
    try {
        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
        let res;
        [temp, res] = await Promise.all([
            modules.getlang(msg, logger),
            searchModule.image(msg.text)
        ]);
        if(typeof(res) == 'undefined') {
            bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id});
            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image not found');
        } else {
            try{ 
                await bot.sendPhoto(chatid, res.img, {reply_markup: {
                    inline_keyboard: [[{
                        text: temp.inline('command.img.visit_page'),
                        url: res.url
                    }, {
                        text: temp.inline('command.img.view_image'),
                        url: res.img
                    }]]
                    }, reply_to_message_id: msg.message_id});
                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search success');
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                logger.debug(e.message);
                try {
                    await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                        .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text),
                            {reply_markup:{ inline_keyboard: [[{
                                text: '@'+global.botinfo.username+' img '+msg.text,
                                switch_inline_query_current_chat: 'img '+msg.text
                            }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                } catch(e) {
                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error send error');
                    logger.debug(e.message);
                }
            }
        }
    } catch(e) {
        logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error');
        logger.debug(e.message);
        try {
            await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text),
                {reply_markup:{ inline_keyboard: [[{
                    text: '@'+global.botinfo.username+' img '+msg.text,
                    switch_inline_query_current_chat: 'img '+msg.text
                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
        } catch(e) {
            logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error send error');
            logger.debug(e.message);
        }
    }
}
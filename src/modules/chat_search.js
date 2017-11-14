module.exports = (bot, logger, helper) => {
    bot.onText(/\{(?:gg|문서|검색|구글|google) (.*)(?:\{|\})/, async(msg, match) => {
        const type = 'google';
        const chatid = msg.chat.id;
        let temp;
        try{
            logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+type+', type: chat command received');
            [send, temp] = await Promise.all([
                bot.sendChatAction(chatid, 'typing'),
                helper.getlang(msg, logger)
            ]);
            let res = await helper.search(match[1]);
            if(res == '') {
                await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+type+', type: valid, response: not found');
            } else if(res == false) {
                await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.bot_block'), {reply_to_message_id: msg.message_id});
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+type+', type: valid, response: google bot block');
            } else {
                try {
                    await bot.sendMessage(chatid, res, {parse_mode: 'HTML', disable_web_page_preview: true, reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [[{
                                text: temp.inline('command.search.another'),
                                url: 'https://www.google.com/search?q='+encodeURIComponent(match[1])+'&ie=UTF-8'
                            },{
                                text: temp.inline('command.img.another'),
                                switch_inline_query_current_chat: 'img '+match[1]
                            }]]
                        }});
                    logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+type+', type: valid, response: search success');
                } catch(e) {
                    sendError(e, chatid, temp, msg, match, type);
                }
            }
        } catch(e) {
            sendError(e, chatid, temp, msg, match, type);
        }
        async function sendError(e, chatid, temp, msg, match, type) {
            logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error');
            logger.debug(e.stack);
            try {
                await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                    .replace([/{botid}/g], global.botinfo.username).replace(/{keyword}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
                    text: '@'+global.botinfo.username+' search '+match[1],
                    switch_inline_query_current_chat: 'search '+match[1]
                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error send error');
                logger.debug(e.stack);
            }
        }
    });
}
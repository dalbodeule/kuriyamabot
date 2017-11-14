module.exports = (bot, logger, helper) => {
    bot.on('message', async (msg) => {
        if(!msg.reply_to_message) return;
        if(msg.reply_to_message.from.username != global.botinfo.username) return;
        if(!msg.reply_to_message.match(/🔍❗️/)) return;

        const chatid = msg.chat.id;
        let temp;
        try {
            logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
            await bot.sendChatAction(chatid, 'typing');
            let response = await helper.search(msg.text);
            if(response == '') {
                await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: not found');
            } else if(response == false) {
                bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: google bot block');
            } else {
                try {
                    await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
                        "\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            inline_keyboard: [[{
                                text: temp.inline('command.search.another'),
                                url: 'https://www.google.com/search?q='+encodeURIComponent(msg.text)+'&ie=UTF-8'
                            }, {
                                text: temp.inline('command.search.another'),
                                switch_inline_query_current_chat: 'search '+msg.text
                        }]]
                    }});
                    logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: search success');
                } catch(e) {
                    sendError(e, chatid, temp, msg);
                }
            }
        } catch(e) {
            sendError(e, chatid, temp, msg);
        }
        async function sendError(e, chatid, temp, msg) {
            logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
            logger.debug(e.stack)
            try {
                await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text), {reply_markup:{ inline_keyboard: [[{
                    text: '@'+global.botinfo.username+' search '+msg.text,
                    switch_inline_query_current_chat: 'search '+msg.text
                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                logger.debug(e.stack);
            }
        }
    });
}
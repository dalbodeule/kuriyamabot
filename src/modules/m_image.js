module.exports = (bot, logger, helper) => {
    bot.onText(/🖼❗️/, async (msg, match) => {
        try {
            logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
            let send;
            [send, temp] = await Promise.all([
                bot.sendChatAction(chatid, 'upload_photo'),
                helper.getlang(msg, logger)
            ]);
            let res = await helper.image(msg.text);
            if(typeof(res) == 'undefined') {
                await bot.sendChatAction(chatid, 'typing');
                await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id})
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image not found');
            } else {
                try { 
                    await bot.sendChatAction(chatid, 'upload_photo');
                    await bot.sendPhoto(chatid, res.img, {reply_markup: {
                        inline_keyboard: [[{
                            text: temp.inline('command.img.visit_page'),
                            url: res.url
                        }, {
                            text: temp.inline('command.img.view_image'),
                            url: res.img
                        }],
                        [{
                            text: temp.inline('command.img.another'),
                            switch_inline_query_current_chat: 'img '+msg.text
                        }]]
                        }, reply_to_message_id: msg.message_id});
                    logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search success');
                } catch(e) {
                    try { 
                        await bot.sendChatAction(chatid, 'upload_photo');
                        res = await searchModule.image(msg.text);
                        await bot.sendPhoto(chatid, res.img, {reply_markup: {
                            inline_keyboard: [[{
                                text: temp.inline('command.img.visit_page'),
                                url: res.url
                            }, {
                                text: temp.inline('command.img.view_image'),
                                url: res.img
                            }],
                            [{
                                text: temp.inline('command.img.another'),
                                switch_inline_query_current_chat: 'img '+msg.text
                            }]]
                            }, reply_to_message_id: msg.message_id});
                        logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search success');
                    } catch(e) {
                        sendError(e, chatid, temp, msg);
                    }
                }
            }
        } catch(e) {
            
        }
        async function sendError(e, chatid, temp, msg) {
            logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error');
            logger.debug(e.stack);
            try {
                await bot.sendChatAction(chatid, 'typing');
                await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.img.error')
                    .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, msg.text),
                    {reply_markup:{ inline_keyboard: [[{
                        text: '@'+global.botinfo.username+' img '+msg.text,
                        switch_inline_query_current_chat: 'img '+msg.text
                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error send error');
                logger.debug(e.stack);
            }
        }
    });
}
module.exports = (bot, logger, helper) => {
    bot.onText(new RegExp('^\/(?:검색|google|search|gg)+(?:@'+global.botinfo.username+')? (.+)$'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try{
				logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				[temp] = await Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper.getlang(msg, logger)
                ]);
				let response = await helper.search(match[1]);
				if(response == '') {
					await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} else if(response == false) {
					await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.bot_block'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: google bot block');
				} else {
					try {
						await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
							"\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
							reply_to_message_id: msg.message_id,
							reply_markup: {
								inline_keyboard: [[{
									text: temp.inline('command.search.another'),
									url: 'https://www.google.com/search?q='+encodeURIComponent(match[1])+'&ie=UTF-8'
								}, {
									text: temp.inline('command.search.another'),
									switch_inline_query_current_chat: 'search '+match[1]
							}]]
						}});
						logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						sendError(e);
					}
				}
			} catch(e) {
				sendError(e);
			}
        }
        function sendError(e) {
            try {
                await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
                    .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
                        text: '@'+global.botinfo.username+' search '+match[1],
                        switch_inline_query_current_chat: 'search '+match[1]
                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                logger.debug(e.stack);
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
                logger.debug(e.stack);
            }
        }
    });

    bot.onText(new RegExp('^\/(?:검색|google|search|gg)+(?:@'+global.botinfo.username+')? ?$'), async (msg, match) => {
        if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try{
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
                [temp] = await Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper.getlang(msg, logger)
                ]);	
                try {
                    await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.blank'), {reply_to_message_id: msg.message_id, reply_markup: {
                        force_reply: true, selective: true
                    }});
                    logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
                } catch(e) {
                    logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                    logger.debug(e.stack);
                }
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
                logger.debug(e.stack);
            }
        }
    });
}
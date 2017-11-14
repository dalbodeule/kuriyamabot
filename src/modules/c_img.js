module.exports = (bot, logger, helper) => {
    bot.onText(new RegExp('^\/(?:짤|이미지|img|image|pic)+(?:@'+global.botinfo.username+')? (.*)$'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				let send;
                [send, temp] = await Promise.all([
                    bot.sendChatAction(chatid, 'upload_photo'),
                    helper.getlang(msg, logger)
                ]);
				let response = await helper.image(match[1]);
				if(typeof(response) == 'undefined') {
					await bot.sendChatAction(chatid, 'typing');
					await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} else {
					try {
						await bot.sendChatAction(chatid, 'upload_photo');
						await bot.sendPhoto(chatid, response.img, {reply_markup: {
							inline_keyboard: [[{
								text: temp.inline('command.img.visit_page'),
								url: response.url
							}, {
								text: temp.inline('command.img.view_image'),
								url: response.img
							}],
							[{
								text: temp.inline('command.img.another'),
								switch_inline_query_current_chat: 'img '+match[1]
							}]]
							}, reply_to_message_id: msg.message_id});
						logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						try {
							await bot.sendChatAction(chatid, 'upload_photo');
							response = await helper.image(match[1]);
							await bot.sendPhoto(chatid, response.img, {reply_markup: {
								inline_keyboard: [[{
									text: temp.inline('command.img.visit_page'),
									url: response.url
								}, {
									text: temp.inline('command.img.view_image'),
									url: response.img
								}],
								[{
									text: temp.inline('command.img.another'),
									switch_inline_query_current_chat: 'img '+match[1]
								}]]
								}, reply_to_message_id: msg.message_id});
							logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
						} catch(e) {
                            sendError(e, chatid, temp, msg, match);
						}
					}
				}
			} catch(e) {
				sendError(e, chatid, temp, msg, match);
			}
        }
        
        async function sendError(e, chatid, temp, msg, match) {
            try {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                logger.debug(e.stack);
                await bot.sendChatAction(chatid, 'typing');
                await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.img.error')
                .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]),
                {reply_markup:{ inline_keyboard: [[{
                    text: '@'+global.botinfo.username+' img '+match[1],
                    switch_inline_query_current_chat: 'img '+match[1]
                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
            } catch(e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
                logger.debug(e.stack);
            }
        }
    });
    
    bot.onText(new RegExp('^\/(?:짤|이미지|사진|img|image|pic)+(?:@'+global.botinfo.username+')? ?$'), async(msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				let send;
                [send, temp] = await Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper.getlang(msg, logger)
                ]);
				try {
					await bot.sendMessage(chatid, "🖼❗️ "+temp.text(msg.chat.type, 'command.img.blank'), {reply_to_message_id: msg.message_id, reply_markup: {
						force_reply: true, selective: true
					}});
					logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} catch(e) {
					logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					logger.debug(e.stack);
				}
			}
			catch(e) {
				logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
				logger.debug(e.stack);
			}
		}
    });
}
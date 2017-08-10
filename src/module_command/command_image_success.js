"use strict"

module.exports = (bot, logger, modules) => {
	const searchModule = require('../modules/search.js');
    bot.onText(new RegExp('^\/(?:짤|이미지|img|image|pic)+(?:@'+global.botinfo.username+')? (.*)'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				let response;
				[temp, response] = await Promise.all([
					modules.getlang(msg, logger),
					searchModule.image(match[1])
				]);
				if(typeof(response) == 'undefined') {
					bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} else {
					try {
						await bot.sendPhoto(chatid, response.img, {reply_markup: {
							inline_keyboard: [[{
								text: temp.inline('command.img.visit_page'),
								url: response.url
							}, {
								text: temp.inline('command.img.view_image'),
								url: response.img
							}]]
							}, reply_to_message_id: msg.message_id});
						logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						try {
							await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.img.error')
								.replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]),
									{reply_markup:{ inline_keyboard: [[{
										text: '@'+global.botinfo.username+' img '+match[1],
										switch_inline_query_current_chat: 'img '+match[1]
									}]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
							logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
							logger.debug(e.stack);
						} catch(e) {
							logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
							logger.debug(e.stack);
						}
					}
				}
			} catch(e) {
				try {
					await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.img.error')
						.replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]),
						{reply_markup:{ inline_keyboard: [[{
							text: '@'+global.botinfo.username+' img '+match[1],
							switch_inline_query_current_chat: 'img '+match[1]
						}]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
					logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
					logger.debug(e.stack);
				} catch(e) {
					logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
					logger.debug(e.stack);
				}
			}
		}
	});
}
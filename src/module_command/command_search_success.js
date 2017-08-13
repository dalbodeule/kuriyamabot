"use strict";

module.exports = (bot, logger, modules) => {
    const searchModule = require('../modules/search.js');
    bot.onText(new RegExp('^\/(?:검색|google|search|gg)+(?:@'+global.botinfo.username+')? (.+)'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try{
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				let response;
				[temp, response] = await Promise.all([
					modules.getlang(msg, logger),
					searchModule.search(match[1]),
					bot.sendChatAction(chatid, 'typing')
				]);
				if(response == '') {
					bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} else {
					try {
						await Promise.all([
							bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
								"\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
								reply_to_message_id: msg.message_id,
								reply_markup: {
									inline_keyboard: [[{
										text: temp.inline('command.search.another'),
										url: 'https://www.google.com/search?q='+encodeURIComponent(match[1])+'&ie=UTF-8'
									}]]
							}}),
							bot.sendChatAction(chatid, 'typing')
						]);
						logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						try {
							await Promise.all([
								bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
									.replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
									text: '@'+global.botinfo.username+' search '+match[1],
									switch_inline_query_current_chat: 'search '+match[1]
								}]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'}),
								bot.sendChatAction(chatid, 'typing')
							]);
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
					await Promise.all([
						bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
							.replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
								text: '@'+global.botinfo.username+' search '+match[1],
								switch_inline_query_current_chat: 'search '+match[1]
							}]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'}),
						bot.sendChatAction(chatid, 'typing')
					]);
					logger.error('chatid: '+chatid+', command: '+msg.text+', type: error');
					logger.debug(e.stack);
				} catch(e) {
					logger.error('chatid: '+chatid+', command: '+msg.text+', type: error send error');
					logger.debug(e.stack);
				}
			}
		}
    });
}
"use strict";
module.exports = (bot, logger, modules) => {
	const format = (time) => {
        let pad = (s) => {
            return (s < 10 ? '0' : '') + s;
        }
        let hours = Math.floor(time / (60*60));
        let minutes = Math.floor(time % (60*60) / 60);
        let seconds = Math.floor(time % 60);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
	}
	const searchModule = require('./modules/search.js');

	bot.onText(new RegExp('^/start+(?:@'+global.botinfo.username+')?'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try{
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				bot.sendMessage(chatid, "👋 "+temp.group('command.start')
					.replace(/{arg1}/g, global.botinfo.username)
					.replace(/{arg2}/g, global.botinfo.first_name), {reply_to_message_id: msg.message_id});			
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
			} catch (e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});
    
	bot.onText(new RegExp('^\/(?:작동시간|uptime)+(?:@'+global.botinfo.username+')?'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				bot.sendMessage(chatid, "✅ "+temp.text(msg.chat.type, 'command.uptime').replace(/{arg1}/g, format(process.uptime())), {
					reply_to_message_id: msg.message_id});
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
			} catch (e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});
    
	/*bot.onText(/\/inline+/, (msg, match) => {
		const chatid = msg.chat.id;
		
		bot.sendMessage(chatid, 'inline keyboard is setuped!', {
			reply_markup: {
				inline_keyboard: [[{
					text: 'naver',
					url: 'https://www.naver.com/'
				},{
					text: 'google',
					url: 'https://google.com'
				}]]
			}
		});
		
		logger.info('chatid: '+chatid+', command: '+msg.text+', type: valid');
	});
    
	bot.onText(/\/keyboard+/, (msg, match) => {
		const chatid = msg.chat.id;
		
		bot.sendMessage(chatid, 'keyboard is setuped!', {
			reply_markup: {
				keyboard: [
					["!start"], ["!inline"]
				],
				one_time_keyboard: true,
				resize_keyboard: true,
                selective: true
			}
		});
		logger.info('chatid: '+chatid+', command: '+msg.text+', type: valid');
	});*/
    
	bot.onText(new RegExp('^\/(?:검색|google|search)+(?:@'+global.botinfo.username+')? (.+)'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try{
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				let response;
				[temp, response] = await Promise.all([
					modules.getlang(msg, logger),
					searchModule.search(match[1])
				]);
				if(response == '') {
					bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
					logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} else {
					try {
						await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
							"\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
							reply_to_message_id: msg.message_id,
							reply_markup: {
								inline_keyboard: [[{
									text: temp.inline('inline.search.another'),
									url: 'https://www.google.com/search?q='+encodeURIComponent(match[1])+'&ie=UTF-8'
								}]]
						}});
						logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						try {
							await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
								.replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
								text: '@'+global.botinfo.username+' search '+match[1],
								switch_inline_query_current_chat: 'search '+match[1]
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
					await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.search.error')
						.replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, match[1]), {reply_markup:{ inline_keyboard: [[{
							text: '@'+global.botinfo.username+' search '+match[1],
							switch_inline_query_current_chat: 'search '+match[1]
						}]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
					logger.error('chatid: '+chatid+', command: '+msg.text+', type: error');
					logger.debug(e.stack);
				} catch(e) {
					logger.error('chatid: '+chatid+', command: '+msg.text+', type: error send error');
					logger.debug(e.stack);
				}
			}
		}
    });
    
    bot.onText(new RegExp('^\/(?:검색|google|search)+(?:@'+global.botinfo.username+')? ?$'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try{
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				try {
					await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.blank'), {reply_to_message_id: msg.message_id, reply_markup: {
						force_reply: true, selective: true
					}});
					logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} catch(e) {
					logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
					logger.debug(e.stack);
				}
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
				logger.debug(e.stack);
			}
		}
	});
		
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
								text: temp.inline('inline.img.visit_page'),
								url: response.url
							}, {
								text: temp.inline('inline.img.view_image'),
								url: response.img
							}]]
							}, reply_to_message_id: msg.message_id});
						logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					} catch(e) {
						try {
							await bot.sendMessage(chatid, "❗️ "+temp.text(msg.chat.type, 'command.img.error')
								.replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, match[1]),
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
						.replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, match[1]),
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
    bot.onText(new RegExp('^\/(?:짤|이미지|사진|img|image|pic)+(?:@'+global.botinfo.username+')? ?$'), async(msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				try {
					await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.blank'), {reply_to_message_id: msg.message_id, reply_markup: {
						force_reply: true, selective: true
					}});
					logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
				} catch(e) {
					logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
					logger.debug(e.stack);
				}
			}
			catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
				logger.debug(e.stack);
			}
		}
    });
    bot.onText(new RegExp('^/\(?:help|도움말)+(?:@'+global.botinfo.username+')? ?$'), async (msg, match) => {
        if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				await bot.sendMessage(chatid, "📒 "+temp.help('command.help.help'), {reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
					inline_keyboard: modules.commandlist(temp)
				}});
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});
	bot.onText(new RegExp('^/\(?:언어변경|언어|lang|langset)+(?:@'+global.botinfo.username+')? ?$'), async(msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
			logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
			temp = await modules.getlang(msg, logger);
				let ctype = msg.chat.type;
				if(ctype == 'group' || ctype == 'supergroup' || ctype == 'channel') {
					await bot.sendMessage(chatid, "❗️ "+temp.group('command.lang.isgroup'), {reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
							inline_keyboard: [[{
								text: temp.inline('inline.tobot'),
								url: 'https://t.me/'+global.botinfo.username
							}]]
						}});
				} else {
					await bot.sendMessage(chatid, "🔤 "+temp.group('command.lang.announce'), {reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
						inline_keyboard: modules.langlist()
					}});
				}
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid,');
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});

	bot.onText(new RegExp('^/\(?:정보|me)+(?:@'+global.botinfo.username+')? ?$'), async(msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				await bot.sendMessage(chatid, "📟 "+temp.group('command.me')
					.replace(/{arg1}/g, msg.from.id)
					.replace(/{arg2}/g, (typeof msg.from.first_name == 'undefined' ? 'none' : msg.from.first_name))
					.replace(/{arg3}/g, (typeof msg.from.last_name == 'undefined' ? 'none' : msg.from.last_name))
					.replace(/{arg4}/g, (typeof msg.from.username == 'undefined' ? 'none' : '@'+msg.from.username))
					.replace(/{arg5}/g, temp.lang), {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid,');
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});
}
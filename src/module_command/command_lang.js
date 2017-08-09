"use strict";

module.exports = async(bot, logger, modules) => {
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
}
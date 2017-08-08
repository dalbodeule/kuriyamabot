"use strict";

module.exports = async(bot, logger, modules) => {
    bot.onText(new RegExp('^/\(?:정보|me)+(?:@'+global.botinfo.username+')? ?$'), async(msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				await bot.sendMessage(chatid, "📟 "+temp.group('command.me')
					.replace(/{id}/g, msg.from.id)
					.replace(/{fname}/g, (typeof msg.from.first_name == 'undefined' ? 'none' : msg.from.first_name))
					.replace(/{lname}/g, (typeof msg.from.last_name == 'undefined' ? 'none' : msg.from.last_name))
					.replace(/{name}/g, (typeof msg.from.username == 'undefined' ? 'none' : '@'+msg.from.username))
					.replace(/{lang}/g, temp.lang), {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid,');
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.message);
			}
		}
    });
}
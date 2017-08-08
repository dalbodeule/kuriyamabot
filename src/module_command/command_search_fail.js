"use strict";

module.exports = async(bot, logger, modules) => {
    bot.onText(new RegExp('^\/(?:검색|google|search|gg)+(?:@'+global.botinfo.username+')? ?$'), async (msg, match) => {
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
					logger.debug(e.message);
				}
			} catch(e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error send error');
				logger.debug(e.message);
			}
		}
	});
}
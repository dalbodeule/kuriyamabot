"use strict";

module.exports = async(bot, logger, modules) => {
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
}
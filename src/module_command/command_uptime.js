"use strict";

module.exports = async(bot, logger, modules) => {
	const format = (time) => {
        let pad = (s) => {
            return (s < 10 ? '0' : '') + s;
        }
        let hours = Math.floor(time / (60*60));
        let minutes = Math.floor(time % (60*60) / 60);
        let seconds = Math.floor(time % 60);

		/*return pad(hours) + '{hour} ' + pad(minutes) + '{min} ' + pad(seconds)+'{sec}';*/
		return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
	}
    bot.onText(new RegExp('^\/(?:작동시간|uptime)+(?:@'+global.botinfo.username+')?'), async (msg, match) => {
		if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
			const chatid = msg.chat.id;
			let temp;
			try {
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
				temp = await modules.getlang(msg, logger);
				bot.sendMessage(chatid, "✅ "+temp.text(msg.chat.type, 'command.uptime.message')
					.replace(/{uptime}/g, format(process.uptime()))
					/*.replace(/{hour}/g, temp.person('command.uptime.hour'))
					.replace(/{min}/g, temp.person('command.uptime.min'))
					.replace(/{sec}/g, temp.person('command.uptime.sec'))*/, {
					reply_to_message_id: msg.message_id});
				logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
			} catch (e) {
				logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
				logger.debug(e.stack);
			}
		}
	});
}
module.exports = (bot, logger, helper) => {
    bot.onText(new RegExp('^/start+(?:@'+global.botinfo.username+')? ?$'), async (msg, match) => {
        if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try{
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
                [temp] = await Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper.getlang(msg, logger)
                ]);
                await bot.sendMessage(chatid, "👋 "+temp.group('command.start')
                    .replace(/{botid}/g, global.botinfo.username)
                    .replace(/{botname}/g, global.botinfo.first_name), {reply_to_message_id: msg.message_id});			
                logger.info('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid');
            } catch (e) {
                logger.error('chatid: '+chatid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                logger.debug(e.stack);
            }
        }
    });
}
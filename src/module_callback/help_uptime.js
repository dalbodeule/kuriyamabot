"use strict";

module.exports = async(bot, logger, modules, msg, callid, temp, answer) => {
    if(msg.message.text != "✅ "+temp.help('command.help.uptime')) {
        try {
            temp = await modules.getlang(msg, logger);
            await bot.editMessageText("✅ "+temp.help('command.help.uptime'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                inline_keyboard: modules.commandlist(temp)}});
            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
        } catch(e) {
            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
            logger.debug(e.message);
        }
    } else {
        answer(msg, temp);
    }
}
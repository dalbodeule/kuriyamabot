"use strict";
module.exports = async (bot, logger, modules, msg) => {
    const chatid = msg.chat.id;
    let temp;
    try{
        temp = await modules.getlang(msg, logger);
        if(msg.left_chat_member.id != global.botinfo.id) {
            bot.sendMessage(chatid, "👋 "+temp.text(msg.chat.type, 'message.left').replace(/{arg1}/g, msg.chat.title).replace(/{arg2}/g, msg.left_chat_member.first_name),
                {reply_to_message_id: msg.message_id});
            logger.info('message: chat left, chatid: '+chatid+', userid: '+msg.left_chat_member.id+', username: '+msg.from.username);
        } else {
            logger.info('message: chat left, chatid: '+chatid+', I\'m has left');
        }
    } catch(e) {
        logger.error('message: chat left, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username+' status: error');
        logger.debug(e.stack);
    }
}
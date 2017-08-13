"use strict"
module.exports = async (bot, logger, modules, msg) => {
    const chatid = msg.chat.id;
    let temp;
    try{
        [temp] = await Promise.all([
            modules.getlang(msg, logger),
            bot.sendChatAction(chatid, 'typing')
        ]);
        if(msg.new_chat_member.id != global.botinfo.id) {
            await Promise.all([
                bot.sendMessage(chatid, temp.text(msg.chat.type, 'message.join').replace(/{roomid}/g, msg.chat.title).replace(/{userid}/g, msg.new_chat_member.first_name),
                    {reply_to_message_id: msg.message_id}),
                bot.sendChatAction(chatid, 'typing')
            ]);
            logger.info('message: chat join, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username);
        } else {
            await Promise.all([
                bot.sendMessage(chatid, "👋 "+temp.text(msg.chat.type, 'message.botjoin')),
                bot.sendChatAction(chatid, 'typing')
            ]);
            logger.info('message: chat join, chatid: '+chatid+', i\'m join room!');
        }
    } catch(e) {
        logger.error('message: chat join, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username+' status: error');
        logger.debug(e.stack);
    }
}
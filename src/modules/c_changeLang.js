module.exports = (bot, logger, helper) => {
    bot.on('callback_query', async(msg) => {
        let test = msg.data.match(/changelang_([a-zA-Z]{2})/);
        if(test) {
            const callid = msg.id;
            let temp;
            try {
                logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: callback received');
                try {
                    temp = await modules.getlang(msg, logger);
                    await temp.langset(regex[1]);
                    await bot.editMessageText(temp.person('command.lang.success'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                            reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                    logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                } catch(e) {
                    try {
                        await bot.editMessageText("❗️ "+temp.group('command.lang.error'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                            reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                        logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                        logger.debug(e.stack);
                    } catch(e) {
                        logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error send error');
                        logger.debug(e.stack);
                    }
                }
            } catch(e) {
                logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                logger.debug(e.message);
            }
        }
    });
}
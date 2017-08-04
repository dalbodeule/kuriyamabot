"use strict";
module.exports = (bot, logger, modules) => {
    const answer = (msg, temp) => {
        bot.answerCallbackQuery(msg.id, temp.group('command.help.twice'));
    }
    
    bot.on('callback_query', async (msg) => {
        const callid = msg.id;
        let temp;
        try {
            temp = await modules.getlang(msg, logger);
            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: callback received');
            try {
                if(msg.data == 'help_image') {
                    if(msg.message.text != temp.help('command.help.img')) {
                        try {
                            await bot.editMessageText("🖼 "+temp.help('command.help.img'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                    reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                    inline_keyboard: modules.commandlist(temp)}});
                                logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');               
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help') {
                    if(msg.message.text != "📒 "+temp.help('command.help.help')) {
                        try {
                            await bot.editMessageText("📒 "+temp.help('command.help.help'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help_search') {
                    if(msg.message.text != "🔍 "+temp.help('command.help.search')) {
                        try {
                            await bot.editMessageText("🔍 "+temp.help('command.help.search'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help_start') {
                    if(msg.message.text != "👋 "+temp.help('command.help.start')) {
                        try {
                            temp = await modules.getlang(msg, logger);
                            await bot.editMessageText("👋 "+temp.help('command.help.start'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help_uptime') {
                    if(msg.message.text != "✅ "+temp.help('command.help.uptime')) {
                        try {
                            temp = await modules.getlang(msg, logger);
                            await bot.editMessageText("✅ "+temp.help('command.help.uptime'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help_lang') {
                    if(msg.message.text != "🔤 "+temp.help('command.help.lang')) {
                        try {
                            temp = await modules.getlang(msg, logger);
                            await bot.editMessageText("🔤 "+temp.help('command.help.lang'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'help_me') {
                    if(msg.message.text != "📟 "+temp.help('command.help.me')) {
                        try {
                            await bot.editMessageText("📟 "+temp.help('command.help.me'), {chat_id: msg.message.chat.id, message_id: msg.message.message_id, 
                                reply_to_message_id: msg.message_id, parse_mode: 'HTML', reply_markup: {
                                inline_keyboard: modules.commandlist(temp)}});
                            logger.info('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: valid');     
                        } catch(e) {
                            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: error');
                            logger.debug(e.stack);
                        }
                    } else {
                        answer(msg, temp);
                    }
                } else if(msg.data == 'changelang_ko') {
                    try {
                        await temp.langset('ko', msg);
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
                } else if(msg.data == 'changelang_en') {
                    try {
                        await temp.langset('en', msg);
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
                }
            } catch(e) {
                logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
                logger.debug(e.stack);
            }
        } catch(e) {
            logger.error('callback id: '+callid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: error');
            logger.debug(e.stack);
        }
    });
}
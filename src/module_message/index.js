"use strict";
module.exports = (bot, logger, modules) => {
    const google = require('google-parser');
	
	bot.on('message', async (msg) => {
        if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            if(typeof msg.text != 'undefined') {
                logger.debug('chatid: '+msg.chat.id+', text: '+msg.text.replace(/\n/g, '\\n')+(typeof msg.chat.username != 'undefined' ? ', username: '+msg.chat.username : ', username: none'));
            }
            const chatid = msg.chat.id;

            if(typeof msg.new_chat_member != 'undefined') {
                require('./message_join.js')(bot, logger, modules, msg); //chat join
            } else if(typeof msg.left_chat_member != 'undefined') {
                require('./message_left.js')(bot, logger, modules, msg); //chat left
            } else if(typeof(msg.reply_to_message) != 'undefined' && msg.reply_to_message.from.username == global.botinfo.username &&
                typeof(msg.reply_to_message.text) != 'undefined') {
                require('./google.js')(bot, logger, modules, msg);
            }
        } else { //testcase time
            if(typeof msg.text != 'undefined') {
                logger.debug('chatid: '+msg.chat.id+', text: '+msg.text.replace(/\n/g, '\\n')+(typeof msg.chat.username != 'undefined' ? ', username: '+msg.chat.username : ', username: none'));
            }
        } //testcase time
    });
}
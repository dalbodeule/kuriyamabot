module.exports = (bot, logger, helper) => {
    bot.on('message', (msg) => {
        if(typeof msg.text != 'undefined') {
            logger.debug('chatid: '+msg.chat.id+', text: '+msg.text.replace(/\n/g, '\\n')+(typeof msg.chat.username != 'undefined' ? ', username: '+msg.chat.username : ', username: none'));
        }
    });
}
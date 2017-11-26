module.exports = (bot, logger, helper) => {
    const answer = (msg, temp) => {
        bot.answerCallbackQuery(msg.id, temp.group('command.help.twice'));
    }
    
    bot.on('callback_query', async (msg) => {
        const callid = msg.id;
        logger.info('callback id: '+callid+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.data+', type: callback received');
    });
}
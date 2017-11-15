module.exports = (bot, logger, helper) => {
    bot.on('inline_query', (msg) => {
        const q = {
            id: msg.id, query: msg.query
        };

        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+q.query+', type: inline command received');
    });
}
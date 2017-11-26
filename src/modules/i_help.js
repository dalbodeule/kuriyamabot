module.exports = (bot, logger, helper) => {
    bot.on('inline_query', async(msg) => {
        const q = {
            id: msg.id, query: msg.query
        }
        
        const match = q.query.match(/^(?:([help]+)(?:| (.*)+))$/);
        if(match) {
            let temp;
            try {
                temp = await helper.getlang(msg, logger);
                await bot.answerInlineQuery(q.id, [{type: 'article', title: 'help message', id: 'help', input_message_content: {
                    message_text: temp.inline('command.help.help.name')+"\n\n"+
                    "🖼 "+temp.inline('command.help.img.name')+"\n\n"+
                    "🔍 "+temp.inline('command.help.search.name')+"\n\n"+
                    "⚙️ "+temp.inline('tobot')
                    , parse_mode: 'HTML'
                }, reply_markup: {
                    inline_keyboard: [[{
                        text: "🖼",
                        switch_inline_query_current_chat: 'img'
                    }, {
                        text: "🔍",
                        switch_inline_query_current_chat: 'search'
                    }], [{
                            text: "⚙️",
                            url: "https://t.me/"+global.botinfo.username
                        }]]
                }}], {cache_time: 3});
            } catch(e) {
                logger.error('inlineid: '+q.id+', username: '+helper.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                logger.debug(e.stack);
            }
        }
    });
}
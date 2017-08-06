"use strict";
module.exports = (bot, logger, modules) => {
    const google = require('google-parser');
    
    bot.on('inline_query', async (msg) => {
        const q = {
            id: msg.id, query: msg.query
        }
        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+q.query+', type: inline command received');
        
        const regex = msg.query.match(/^([^\ ]+)(?: (.+)?$|$)/);
        if(regex == null) {
            logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: not valid');
        } else if(regex[1] == 'photo' || regex[1] == 'image' || regex[1] == 'img' ||
            regex[1] == '짤' || regex[1] == '사진' || regex[1] == '이미지') {
            require('./google_image.js')(bot, logger, modules, msg, q, regex);
        } else if(regex[1] == 'search' || regex[1] == 'google' || regex[1] == 'query' ||
            regex[1] == '검색' || regex[1] == '구글') {
            require('./google_search.js')(bot, logger, modules, msg, q, regex);
        } else {
            logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: not valid');
        }
    });
}
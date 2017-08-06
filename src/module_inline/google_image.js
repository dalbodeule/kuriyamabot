"use strict";

module.exports = async(bot, logger, modules, msg, q, regex) => {
    const google = require('google-parser');
    let temp;
    try {
        temp = await modules.getlang(msg, logger);
        if(typeof regex[2] == 'undefined' || regex[2] == '') {
            try {
                await bot.answerInlineQuery(q.id, [{type: 'article', title: '@'+global.botinfo.username+' (photo|image|img|짤|사진) (검색어)', id: 'help', input_message_content: {
                    message_text: '@'+global.botinfo.username+' (photo|image|img|짤|사진) (검색어)', parse_mode: 'HTML', disable_web_page_preview: true
                    }}], {cache_time: 3});
                logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: not valid, response: help');
            } catch(e) {
                logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid');
                logger.debug(e.stack);
            }
        } else {
            try {
                let res = await google.jpg(regex[2]);
                if(typeof res[0] == 'undefined') {
                    try {
                        await bot.answerInlineQuery(q.id, [{type: 'article', title: 'not found', id: 'not found', input_message_content: {
                            message_text: temp.group('inline.img.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                            }}], {cache_time: 3})
                        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid');
                    } catch(e) {
                        logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                        logger.debug(e.stack);
                    }
                } else {
                    let results = [];
                    for(let i in res) {
                        results.push({type: 'photo', photo_url: res[i].img, thumb_url: res[i].img,
                            id: q.id+'/photo/' + i, reply_markup: {
                                inline_keyboard: [[{
                                    text: temp.inline('inline.img.visit_page'),
                                    url: res[i].url
                                }, {
                                    text: temp.inline('inline.img.view_image'),
                                    url: res[i].img
                                }]]
                            }});
                    }
                    results.splice(50);
                    try {
                        await bot.answerInlineQuery(q.id, results, {cache_time: 3})
                        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid');
                    } catch(e) {
                        try {
                            await bot.answerInlineQuery(q.id, [{type: 'article', title: 'error', id: 'error', input_message_content:{
                                    message_text: temp.group('inline.img.error'), parse_mode: 'HTML', disable_web_page_prefiew: true
                                    }}], {cache_time: 0});
                            logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                            logger.debug(e.stack);
                        } catch(e) {
                            logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error send error');
                            logger.debug(e.stack);
                        }
                    }
                }
            } catch(e) {
                try{
                    await bot.answerInlineQuery(q.id, [{type: 'article', title: 'error', id: 'error', input_message_content: {
                            message_text: temp.group('inline.img.error'), parse_mode: 'HTML', disable_web_page_preview: true
                        }}], {cache_time: 3});
                    logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                    logger.debug(e.stack);
                } catch(e) {
                    logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error send error');
                    logger.debug(e.stack);
                }
            }
        }
    } catch(e) {
        logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
        logger.debug(e.stack);
    }
}
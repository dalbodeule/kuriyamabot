"use strict";

module.exports = async(bot, logger, modules, msg, q, regex) => {
    const google = require('google-parser');
    let temp;
    try {
        temp = await modules.getlang(msg, logger);
        if(typeof regex[2] == 'undefined' || regex[2] == '') {
            try {
                await bot.answerInlineQuery(q.id, [{type: 'article', title: '@'+global.botinfo.username+' [search|google|query|검색|구글] (검색어)', id: 'help', input_message_content: {
                    message_text: '@'+global.botinfo.username+' [search|google|query|검색|구글] (검색어)', parse_mode: 'HTML', disable_web_page_preview: true
                    }}], {cache_time: 3});
                logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: not valid, response: help');
            } catch(e) {
                logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                logger.debug(e.stack);
            }
        } else {
            try {
                let res = await google.search(regex[2]);
                if(res == false) {
                    try {
                        await bot.answerInlineQuery(q.id, [{type: 'article', title: 'search error', id: 'google bot block', input_message_content: {
                            message_text: temp.group('command.search.bot_blcok'), parse_mode: 'HTML', disable_web_page_preview: true
                        }}], {cache_time: 3});
                        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid, response: google bot block');
                    } catch(e) {
                        logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                        logger.debug(e.stack);
                    }
                } else if(typeof res[0] == 'undefined') {
                    try {
                        await bot.answerInlineQuery(q.id, [{type: 'article', title: 'not found', id: 'not found', input_message_content: {
                            message_text: temp.group('command.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                        }}], {cache_time: 3})
                        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid, response: not found');
                    } catch(e) {
                        logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                        logger.debug(e.stack);
                    }
                } else {
                    function getdesc(description, url, title, temp) {
                        if(url.match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+.+$/) != null) {
                            if(url.match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/channel\//) != null) {
                                return '<a href="'+url+'">'+title+"</a> \n\n"+description.replace('&', '&amp;')
                                    .replace('<', '&lt;').replace('>', '&gt;');
                            } else {
                                let shot = url.toString().match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/watch\?v=+([^&]+)/);
                                if(shot == null) {
                                    return url;
                                } else {
                                    return 'https://youtu.be/'+shot[1];
                                }
                            }
                        } else if(description == '') {
                            return temp.group('command.search.desc_null');
                        } else {
                            return '<a href="'+url+'">'+title+"</a> \n\n"+description.replace('&', '&amp;')
                                .replace('<', '&lt;').replace('>', '&gt;');
                        }
                    }
                    let results = [];
                    for(let i in res) {
                        results.push({type: 'article', title: res[i].title, id: q.id+'/document/' + i, input_message_content: {
                            message_text: getdesc(res[i].description, res[i].link, res[i].title, temp), parse_mode: 'HTML'},  reply_markup: {
                                inline_keyboard: [[{
                                    text: temp.inline('command.search.visit_page'),
                                    url: res[i].link
                                }, {
                                    text: temp.inline('command.search.another'),
                                    switch_inline_query_current_chat: 'search '+regex[2]
                                }]]
                            }});
                    }
                    results.splice(30);
                    try {
                        await bot.answerInlineQuery(q.id, results)
                        logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: valid');
                    } catch(e) {
                        try {
                            await bot.answerInlineQuery(q.id, [{type: 'article', title: 'error', id: 'error', input_message_content: {
                                    message_text: temp.group('command.search.not_found')
                                    .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, regex[2]), parse_mode: 'HTML', disable_web_page_preview: true
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
                await bot.answerInlineQuery(q.id, [{type: 'article', title: 'error', id: 'error', input_message_content: {
                        message_text: temp.group('command.search.not_found')
                        .replace(/{botid}/g, '@'+global.botinfo.username).replace(/{keyword}/g, regex[2]), parse_mode: 'HTML', disable_web_page_preview: true
                        }}], {cache_time: 3});
                logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                logger.debug(e.stack);
            }
        }
    } catch(e) {
        logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
        logger.debug(e.stack);
    }
}
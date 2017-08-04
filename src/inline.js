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
            let temp;
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
                    let res;
                    [temp, res] = await Promise.all([
                        modules.getlang(msg, logger),
                        google.jpg(regex[2])
                    ]);
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
        } else if(regex[1] == 'search' || regex[1] == 'google' || regex[1] == 'query' ||
            regex[1] == '검색' || regex[1] == '구글') {
            let temp;
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
                    let res;
                    [temp, res] = await Promise.all([
                        modules.getlang(msg, logger),
                        google.search(regex[2])
                    ]);
                    if(typeof res[0] == 'undefined') {
                        try {
                            await bot.answerInlineQuery(q.id, [{type: 'article', title: 'not found', id: 'not found', input_message_content: {
                                message_text: temp.group('inline.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
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
                                return temp.group('inline.search.desc_null');
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
                                        text: temp.inline('inline.search.visit_page'),
                                        url: res[i].link
                                    }, {
                                        text: temp.inline('inline.search.another'),
                                        url: 'https://www.google.com/search?q='+encodeURIComponent(regex[2])+'&ie=UTF-8'
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
                                        message_text: temp.group('inline.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
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
                            message_text: temp.group('inline.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                            }}], {cache_time: 3});
                    logger.error('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: error');
                    logger.debug(e.stack);
                }
            }
        } else {
            logger.info('inlineid: '+q.id+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.query+', type: not valid');
        }
    });
}
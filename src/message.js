"use strict";
module.exports = (bot, logger, modules) => {
    const google = require('google-parser'), searchModule = require('./modules/search.js');
	
	bot.on('message', async (msg) => {
        if(Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            if(typeof msg.text != 'undefined') {
                logger.debug('chatid: '+msg.chat.id+', text: '+msg.text+(typeof msg.chat.username != 'undefined' ? ', username: '+msg.chat.username : ', username: none'));
            }
            const chatid = msg.chat.id;
            let tcom;
            if(typeof msg.text == 'string') {
                tcom = msg.text.match(/{(img|사진|이미지|짤|gg|문서|검색|구글|google) (.*)}/);
            }
            /*if(typeof msg.text != 'undefined') {
                if(!/^\//.test(msg.text)) {
                    bot.sendMessage(chatid, msg.text);
                    console.log('chatid: '+chatid+', text: '+msg.text);
                }
            } else */if(typeof msg.new_chat_member != 'undefined') {
                let temp;
                try{
                    temp = await modules.getlang(msg, logger);
                    if(msg.new_chat_member.id != global.botinfo.id) {
                        bot.sendMessage(chatid, temp.text(msg.chat.type, 'message.join').replace(/{arg1}/g, msg.chat.title).replace(/{arg2}/g, msg.new_chat_member.first_name),
                            {reply_to_message_id: msg.message_id});
                        logger.info('message: chat join, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username);
                    } else {
                        bot.sendMessage(chatid, "👋 "+temp.text(msg.chat.type, 'message.botjoin'));
                        logger.info('message: chat join, chatid: '+chatid+', i\'m join room!');
                    }
                } catch(e) {
                    logger.error('message: chat join, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username+' status: error');
                    logger.debug(e.stack);
                } //chat join
            } else if(typeof msg.left_chat_member != 'undefined') {
                let temp;
                try{
                    temp = await modules.getlang(msg, logger);
                    if(msg.left_chat_member.id != global.botinfo.id) {
                        bot.sendMessage(chatid, "👋 "+temp.text(msg.chat.type, 'message.left').replace(/{arg1}/g, msg.chat.title).replace(/{arg2}/g, msg.left_chat_member.first_name),
                            {reply_to_message_id: msg.message_id});
                        logger.info('message: chat left, chatid: '+chatid+', userid: '+msg.left_chat_member.id+', username: '+msg.from.username);
                    } else {
                        logger.info('message: chat left, chatid: '+chatid+', I\'m has left');
                    }
                } catch(e) {
                    logger.error('message: chat left, chatid: '+chatid+', userid: '+msg.new_chat_member.id+', username: '+msg.from.username+' status: error');
                    logger.debug(e.stack);
                } //chat left
            } else if(typeof(msg.reply_to_message) != 'undefined' && msg.reply_to_message.from.username == global.botinfo.username &&
                typeof(msg.reply_to_message.text) != 'undefined') {
                if(msg.reply_to_message.text.match(/🔍/) != null ) {
                    let temp;
                    try{
                        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
                        let response;
                        [temp, response] = await Promise.all([
                            modules.getlang(msg, logger),
                            searchModule.search(msg.text)
                        ]);
                        if(response == '') {
                            bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
                            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: not found');
                        } else {
                            try {
                                await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.result')+
                                    "\n"+response, {parse_mode: 'HTML', disable_web_page_preview: true,
                                    reply_to_message_id: msg.message_id,
                                    reply_markup: {
                                        inline_keyboard: [[{
                                            text: temp.inline('inline.search.another'),
                                            url: 'https://www.google.com/search?q='+encodeURIComponent(msg.text)+'&ie=UTF-8'
                                        }]]
                                }});
                                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: search success');
                            } catch(e) {
                                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                                logger.debug(e.stack)
                                try {
                                    await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.error').replace(/{arg1}/g, msg.text), {reply_markup:{ inline_keyboard: [[{
                                        text: '@'+global.botinfo.username+' search '+msg.text,
                                        switch_inline_query_current_chat: 'search '+msg.text
                                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                                } catch(e) {
                                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                                    logger.debug(e.stack);
                                }
                            }
                        }
                    } catch(e) {
                        logger.error('chatid: '+chatid+', command: '+msg.text+', type: valid, response: search error');
                        logger.debug(e.stack);
                        try {
                            await bot.sendMessage(chatid, "🔍 "+temp.text(msg.chat.type, 'command.search.error')
                                .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, msg.text), {reply_markup:{ inline_keyboard: [[{
                                    text: '@'+global.botinfo.username+' search '+msg.text,
                                    switch_inline_query_current_chat: 'search '+msg.text
                                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                        } catch(e) {
                            logger.error('chatid: '+chatid+', command: '+msg.text+', type: valid, response: search error send error');
                            logger.debug(e.stack);
                        }
                    } //google search
                } else if(msg.reply_to_message.text.match(/🖼/) != null) {
                    const chatid = msg.chat.id;
                    let temp;
                    try {
                        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: command received');
                        let res;
                        [temp, res] = await Promise.all([
                            modules.getlang(msg, logger),
                            searchModule.image(msg.text)
                        ]);
                        if(typeof(res) == 'undefined') {
                            bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id});
                            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image not found');
                        } else {
                            try{ 
                                await bot.sendPhoto(chatid, res.img, {reply_markup: {
                                    inline_keyboard: [[{
                                        text: temp.inline('inline.img.visit_page'),
                                        url: res.url
                                    }, {
                                        text: temp.inline('inline.img.view_image'),
                                        url: res.img
                                    }]]
                                    }, reply_to_message_id: msg.message_id});
                                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search success');
                            } catch(e) {
                                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error');
                                logger.debug(e.stack);
                                try {
                                    await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                                        .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, msg.text),
                                            {reply_markup:{ inline_keyboard: [[{
                                                text: '@'+global.botinfo.username+' img '+msg.text,
                                                switch_inline_query_current_chat: 'img '+msg.text
                                            }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                                } catch(e) {
                                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: message send error send error');
                                    logger.debug(e.stack);
                                }
                            }
                        }
                    } catch(e) {
                        logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error');
                        logger.debug(e.stack);
                        try {
                            await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                               .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, msg.text),
                                {reply_markup:{ inline_keyboard: [[{
                                    text: '@'+global.botinfo.username+' img '+msg.text,
                                    switch_inline_query_current_chat: 'img '+msg.text
                                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                        } catch(e) {
                            logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', command: '+msg.text+', type: valid, response: image search error send error');
                            logger.debug(e.stack);
                        }
                    }
                } //img search
            } else if(tcom != null) {
                logger.debug('caht command type: '+tcom[1]);
                logger.debug('caht command keyword: '+tcom[2]);
                if(tcom[1] == 'img' || tcom[1] == '사진' || tcom[1] == '이미지' || tcom[1] == '짤') { //text command image search
                    const chatid = msg.chat.id;
                    let temp;
                    try {
                        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: chat command received');
                        let res;
                        [temp, res] = await Promise.all([
                            modules.getlang(msg, logger),
                            searchModule.image(tcom[2])
                        ]);
                        if(typeof(res) == 'undefined') {
                            bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.not_found'), {reply_to_message_id: msg.message_id});
                            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: image not found');
                        } else {
                            try { 
                                await bot.sendPhoto(chatid, res.img, {reply_markup: {
                                    inline_keyboard: [[{
                                        text: temp.inline('inline.img.visit_page'),
                                        url: res.url
                                    }, {
                                        text: temp.inline('inline.img.view_image'),
                                        url: res.img
                                    }]]
                                    }, reply_to_message_id: msg.message_id});
                                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: image search success');
                            } catch(e) {
                                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: message send error');
                                logger.debug(e.stack);
                                try {
                                    await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                                        .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, tcom[2]),
                                            {reply_markup:{ inline_keyboard: [[{
                                                text: '@'+global.botinfo.username+' img '+tcom[2],
                                                switch_inline_query_current_chat: 'img '+tcom[2]
                                        }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                                } catch(e) {
                                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: message send error send error');
                                    logger.debug(e.stack);
                                }
                            }
                        }
                    } catch(e) {
                        logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: image search error');
                        logger.debug(e.stack);
                        try {
                            await bot.sendMessage(chatid, "🖼 "+temp.text(msg.chat.type, 'command.img.error')
                                .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, tcom[2]),
                                    {reply_markup:{ inline_keyboard: [[{
                                        text: '@'+global.botinfo.username+' img '+tcom[2],
                                        switch_inline_query_current_chat: 'img '+tcom[2]
                                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                        } catch(e) {
                            logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: image search error send error');
                            logger.debug(e.stack);
                        }
                    }
                } else if(tcom[1] == 'gg' || tcom[1] == '문서' || tcom[1] == '검색'
                    || tcom[1] == '구글' || tcom[1] == 'google') {
                    let temp;
                    try{
                        logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: chat command received');
                        let response;
                        [temp, response] = await Promise.all([
                            modules.getlang(msg, logger),
                            searchModule.search(msg.text)
                        ]);
                        if(response == '') {
                            bot.sendMessage(chatid, temp.text(msg.chat.type, 'command.search.not_found'), {reply_to_message_id: msg.message_id});
                            logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: not found');
                        } else {
                            try {
                                await bot.sendMessage(chatid, response, {parse_mode: 'HTML', disable_web_page_preview: true, reply_to_message_id: msg.message_id,
                                    reply_markup: {
                                        inline_keyboard: [[{
                                            text: temp.inline('inline.search.another'),
                                            url: 'https://www.google.com/search?q='+encodeURIComponent(tcom[2])+'&ie=UTF-8'
                                        }]]}});
                                logger.info('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+tcom[0]+', type: valid, response: search success');
                            } catch(e) {
                                logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error');
                                logger.debug(e.stack);
                                try {
                                    await bot.sendMessage(chatid, temp.text(msg.chat.type, 'command.search.error')
                                        .replace([/{arg1}/g], global.botinfo.username).replace(/{arg2}/g, tcom[2]), {reply_markup:{ inline_keyboard: [[{
                                        text: '@'+global.botinfo.username+' search '+tcom[2],
                                        switch_inline_query_current_chat: 'search '+tcom[2]
                                    }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                                } catch(e) {
                                    logger.error('chatid: '+chatid+', username: '+modules.getuser(msg.from)+', lang: '+msg.from.language_code+', chat command: '+msg.text+', type: valid, response: message send error send error');
                                    logger.debug(e.stack);
                                }
                            }
                        }
                    } catch(e) {
                        logger.error('chatid: '+chatid+', chat command: '+tcom[0]+', type: valid, response: search error');
                        logger.debug(e.stack);
                        try {
                            await bot.sendMessage(chatid, temp.text(msg.chat.type, 'command.search.error')
                                .replace(/{arg1}/g, '@'+global.botinfo.username).replace(/{arg2}/g, tcom[2]), {reply_markup:{ inline_keyboard: [[{
                                    text: '@'+global.botinfo.username+' search '+tcom[2],
                                    switch_inline_query_current_chat: 'search '+tcom[2]
                                }]]}, reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
                        } catch(e) {
                            logger.error('chatid: '+chatid+', chat command: '+tcom[0]+', type: valid, response: search error send error');
                            logger.debug(e.stack);
                        }
                    }
                }
            } //chat command
        } else {
            logger.debug('chatid: '+msg.chat.id+', text: '+msg.text+(typeof msg.chat.username != 'undefined' ? ', username: '+msg.chat.username : ', username: none'));
        } //testcase time
    });
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const config_1 = require("../config");
exports.default = (bot, logger) => {
    bot.onText(new RegExp('^/(?:검색|google|search|gg)+(?:@' + config_1.default.botinfo.username + ')? (.+)$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
        if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try {
                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received');
                let send;
                [send, temp] = yield Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper_1.default.getlang(msg, logger)
                ]);
                let response = yield helper_1.default.search(match[1]);
                if (response === '') {
                    yield bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.not_found'), { reply_to_message_id: msg.message_id });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                }
                else if (response === false) {
                    yield bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.bot_block'), { reply_to_message_id: msg.message_id });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: google bot block');
                }
                else {
                    try {
                        yield bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.result') +
                            '\n' + response, {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: msg.message_id,
                            reply_markup: {
                                inline_keyboard: [[{
                                            text: temp.text('command.search.visit_google'),
                                            url: 'https://www.google.com/search?q=' + encodeURIComponent(match[1]) + '&ie=UTF-8'
                                        }, {
                                            text: temp.text('command.search.another'),
                                            switch_inline_query_current_chat: 'search ' + match[1]
                                        }]]
                            }
                        });
                        logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                    }
                    catch (e) {
                        sendError(e, chatid, temp, msg, match);
                    }
                }
            }
            catch (e) {
                sendError(e);
            }
        }
        function sendError(e, chatid, temp, msg, match) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield bot.sendMessage(chatid, '❗️ ' + temp.text('command.search.error')
                        .replace(/{botid}/g, '@' + config_1.default.botinfo.username).replace(/{keyword}/g, match[1]), {
                        reply_markup: {
                            inline_keyboard: [[{
                                        text: '@' + config_1.default.botinfo.username + ' search ' + match[1],
                                        switch_inline_query_current_chat: 'search ' + match[1]
                                    }]]
                        },
                        reply_to_message_id: msg.message_id,
                        parse_mode: 'HTML'
                    });
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error');
                    logger.debug(e.stack);
                }
                catch (e) {
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error send error');
                    logger.debug(e.stack);
                }
            });
        }
    }));
    bot.onText(new RegExp('^/(?:검색|google|search|gg)+(?:@' + config_1.default.botinfo.username + ')? ?$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
        if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try {
                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received');
                let send;
                [send, temp] = yield Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper_1.default.getlang(msg, logger)
                ]);
                try {
                    yield bot.sendMessage(chatid, '🔍❗️ ' + temp.text('command.search.blank'), {
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            force_reply: true, selective: true
                        }
                    });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                }
                catch (e) {
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error');
                    logger.debug(e.stack);
                }
            }
            catch (e) {
                logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error send error');
                logger.debug(e.stack);
            }
        }
    }));
};

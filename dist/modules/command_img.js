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
    bot.onText(new RegExp('^/(?:짤|이미지|img|image|pic)+(?:@' + config_1.default.botinfo.username + ')? (.*)$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
        if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try {
                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received');
                let send;
                [send, temp] = yield Promise.all([
                    bot.sendChatAction(chatid, 'upload_photo'),
                    helper_1.default.getlang(msg, logger)
                ]);
                let response = yield helper_1.default.image(match[1]);
                if (typeof (response) === 'undefined') {
                    yield bot.sendChatAction(chatid, 'typing');
                    yield bot.sendMessage(chatid, '🖼 ' + temp.text('command.img.not_found'), { reply_to_message_id: msg.message_id });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                }
                else {
                    try {
                        yield bot.sendChatAction(chatid, 'upload_photo');
                        yield bot.sendPhoto(chatid, response.img, {
                            reply_markup: {
                                inline_keyboard: [[{
                                            text: temp.text('command.img.visit_page'),
                                            url: response.url
                                        }, {
                                            text: temp.text('command.img.view_image'),
                                            url: response.img
                                        }],
                                    [{
                                            text: temp.text('command.img.another'),
                                            switch_inline_query_current_chat: 'img ' + match[1]
                                        }]]
                            },
                            reply_to_message_id: msg.message_id
                        });
                        logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                    }
                    catch (e) {
                        try {
                            yield bot.sendChatAction(chatid, 'upload_photo');
                            response = yield helper_1.default.image(match[1]);
                            yield bot.sendPhoto(chatid, response.img, {
                                reply_markup: {
                                    inline_keyboard: [[{
                                                text: temp.text('command.img.visit_page'),
                                                url: response.url
                                            }, {
                                                text: temp.text('command.img.view_image'),
                                                url: response.img
                                            }],
                                        [{
                                                text: temp.text('command.img.another'),
                                                switch_inline_query_current_chat: 'img ' + match[1]
                                            }]]
                                },
                                reply_to_message_id: msg.message_id
                            });
                            logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                        }
                        catch (e) {
                            sendError(e, chatid, temp, msg, match);
                        }
                    }
                }
            }
            catch (e) {
                sendError(e, chatid, temp, msg, match);
            }
        }
        function sendError(e, chatid, temp, msg, match) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error');
                    logger.debug(e.stack);
                    yield bot.sendChatAction(chatid, 'typing');
                    yield bot.sendMessage(chatid, '❗️ ' + temp.text('command.img.error')
                        .replace(/{botid}/g, '@' + config_1.default.botinfo.username).replace(/{keyword}/g, match[1]), {
                        reply_markup: {
                            inline_keyboard: [[{
                                        text: '@' + config_1.default.botinfo.username + ' img ' + match[1],
                                        switch_inline_query_current_chat: 'img ' + match[1]
                                    }]]
                        },
                        reply_to_message_id: msg.message_id,
                        parse_mode: 'HTML'
                    });
                }
                catch (e) {
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error send error');
                    logger.debug(e.stack);
                }
            });
        }
    }));
    bot.onText(new RegExp('^/(?:짤|이미지|사진|img|image|pic)+(?:@' + config_1.default.botinfo.username + ')? ?$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
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
                    yield bot.sendMessage(chatid, '🖼❗️ ' + temp.text('command.img.blank'), {
                        reply_to_message_id: msg.message_id,
                        reply_markup: {
                            force_reply: true, selective: true
                        }
                    });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
                }
                catch (e) {
                    logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid');
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

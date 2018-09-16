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
const moduleBase_1 = require("../moduleBase");
class ChatImage extends moduleBase_1.command {
    constructor(bot, logger, config) {
        super(bot, logger, config);
        this.regexp = new RegExp('^/(?:검색|google|search|gg)+(?:@' +
            this.config.bot.username + ')? (.+)$');
    }
    module(msg, match) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
                const chatid = msg.chat.id;
                let temp;
                try {
                    this.logger.info('command: search, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: pending');
                    let [send, temp] = yield Promise.all([
                        this.bot.sendChatAction(chatid, 'typing'),
                        this.helper.getlang(msg, this.logger)
                    ]);
                    let response = yield this.helper.search(match[1]);
                    if (!response) {
                        yield this.bot.sendMessage(chatid, '🔍 ' +
                            temp.text('command.search.not_found'), {
                            reply_to_message_id: msg.message_id
                        });
                        this.logger.info('command: search, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: success, response: not founc');
                    }
                    else if (response.error) {
                        yield this.bot.sendMessage(chatid, '🔍 ' +
                            temp.text('command.search.bot_block'), {
                            reply_to_message_id: msg.message_id
                        });
                        this.logger.info('command: search, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: success, response: google bot block');
                    }
                    else {
                        try {
                            yield this.bot.sendMessage(chatid, '🔍 ' +
                                temp.text('command.search.result') + '\n' + response, {
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
                            this.logger.info('command: search, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.text + ', type: valid, response: search success');
                        }
                        catch (e) {
                            yield this.bot.sendMessage(chatid, '❗️ ' +
                                temp.text('command.search.error')
                                    .replace(/{botid}/g, '@' + this.config.bot.username)
                                    .replace(/{keyword}/g, match[1]), {
                                reply_markup: {
                                    inline_keyboard: [[{
                                                text: '@' + this.config.bot.username + ' search ' + match[1],
                                                switch_inline_query_current_chat: 'search ' + match[1]
                                            }]]
                                },
                                reply_to_message_id: msg.message_id,
                                parse_mode: 'HTML'
                            });
                            this.logger.error('command: search, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.text + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                }
                catch (e) {
                    this.logger.error('command: search, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: error');
                    this.logger.debug(e.stack);
                }
            }
        });
    }
}
exports.default = ChatImage;

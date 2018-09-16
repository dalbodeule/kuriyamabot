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
class messageSearch extends moduleBase_1.message {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                return;
            if (!msg.reply_to_message)
                return;
            if (msg.reply_to_message.from.username !==
                this.config.bot.username)
                return;
            if (Math.round((new Date()).getTime() / 1000) -
                msg.reply_to_message.date >= 60)
                return;
            if (!msg.reply_to_message)
                return;
            if (!msg.reply_to_message.text)
                return;
            if (!msg.reply_to_message.text.match(/🔍❗️/))
                return;
            const chatid = msg.chat.id;
            try {
                this.logger.info('message: search, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.text + ', type: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'typing'),
                    this.helper.getlang(msg, this.logger)
                ]);
                let response = yield this.helper.search(msg.text);
                if (!response) {
                    yield this.bot.sendMessage(chatid, '🔍 ' +
                        temp.text('command.search.not_found'), {
                        reply_to_message_id: msg.message_id
                    });
                    this.logger.info('message: search, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: valid, response: not found');
                }
                else if (response.error) {
                    this.bot.sendMessage(chatid, '🔍 ' +
                        temp.text('command.search.not_found'), {
                        reply_to_message_id: msg.message_id
                    });
                    this.logger.info('message: search, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        'command: ' + msg.text + ', type: valid, response: google bot block');
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
                                            text: temp.text('command.search.another'),
                                            url: 'https://www.google.com/search?q=' +
                                                encodeURIComponent(msg.text) + '&ie=UTF-8'
                                        }, {
                                            text: temp.text('command.search.another'),
                                            switch_inline_query_current_chat: 'search ' + msg.text
                                        }]]
                            }
                        });
                        this.logger.info('message: search, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: valid, response: search success');
                    }
                    catch (e) {
                        yield this.bot.sendMessage(chatid, '❗️ ' +
                            temp.text('command.search.error')
                                .replace(/{botid}/g, '@' + this.config.bot.username)
                                .replace(/{keyword}/g, msg.text), {
                            reply_markup: {
                                inline_keyboard: [[{
                                            text: '@' + this.config.bot.username + ' search ' + msg.text,
                                            switch_inline_query_current_chat: 'search ' + msg.text
                                        }]]
                            },
                            reply_to_message_id: msg.message_id,
                            parse_mode: 'HTML'
                        });
                        this.logger.error('message: search chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: error');
                        this.logger.debug(e.stack);
                    }
                }
            }
            catch (e) {
                this.logger.error('message: search chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.text + ', type: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = messageSearch;

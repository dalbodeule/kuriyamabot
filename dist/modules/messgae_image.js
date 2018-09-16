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
class MessageImage extends moduleBase_1.message {
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
            if (!msg.reply_to_message.text.match(/🖼❗️/))
                return;
            const chatid = msg.chat.id;
            try {
                this.logger.info('message: img, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.text + ', type: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'upload_photo'),
                    this.helper.getlang(msg, this.logger)
                ]);
                let response = yield this.helper.image(msg.text);
                if (!response) {
                    yield this.bot.sendChatAction(chatid, 'typing');
                    yield this.bot.sendMessage(chatid, '🖼 ' +
                        temp.text('command.img.not_found'), {
                        reply_to_message_id: msg.message_id
                    });
                    this.logger.info('message: img, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: valid, response: not found');
                }
                else {
                    try {
                        yield this.bot.sendChatAction(chatid, 'upload_photo');
                        yield this.bot.sendPhoto(chatid, response.img, {
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
                                            switch_inline_query_current_chat: 'img ' + msg.text
                                        }]]
                            },
                            reply_to_message_id: msg.message_id
                        });
                        this.logger.info('message: img, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: valid, response: search success');
                    }
                    catch (e) {
                        try {
                            yield this.bot.sendChatAction(chatid, 'upload_photo');
                            response = yield this.helper.image(msg.text);
                            yield this.bot.sendPhoto(chatid, response.img, {
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
                                                switch_inline_query_current_chat: 'img ' + msg.text
                                            }]]
                                },
                                reply_to_message_id: msg.message_id
                            });
                            this.logger.info('message: img, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.text + ', type: valid, response: search success');
                        }
                        catch (e) {
                            yield this.bot.sendChatAction(chatid, 'typing');
                            yield this.bot.sendMessage(chatid, '❗️ ' +
                                temp.text('command.img.error')
                                    .replace(/{botid}/g, '@' + this.config.bot.username)
                                    .replace(/{keyword}/g, msg.text), {
                                reply_markup: {
                                    inline_keyboard: [[{
                                                text: '@' + this.config.bot.username + ' img ' + msg.text,
                                                switch_inline_query_current_chat: 'img ' + msg.text
                                            }]]
                                },
                                reply_to_message_id: msg.message_id,
                                parse_mode: 'HTML'
                            });
                            this.logger.error('message: img, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.text + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                }
            }
            catch (e) {
                this.logger.error('message: img, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.text + ', type: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = MessageImage;

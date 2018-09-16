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
        this.regexp = /\{(?:img|pic|사진|이미지|짤) (.*)(?:\{|\})/;
    }
    module(msg, match) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                return;
            const type = 'image';
            const chatid = msg.chat.id;
            try {
                this.logger.info('command: chat_image, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + type + ', type: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'upload_photo'),
                    this.helper.getlang(msg, this.logger)
                ]);
                let response = yield this.helper.image(match[1]);
                if (!response) {
                    yield this.bot.sendChatAction(chatid, 'typing');
                    yield this.bot.sendMessage(chatid, '🖼 ' + temp.text('command.img.not_found'), { reply_to_message_id: msg.message_id });
                    this.logger.info('command: chat_image, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + type + ', type: valid, response: not found');
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
                                        }], [{
                                            text: temp.text('command.img.another'),
                                            switch_inline_query_current_chat: 'img ' + match[1]
                                        }]]
                            },
                            reply_to_message_id: msg.message_id
                        });
                        this.logger.info('command: chat_image, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + type + ', type: valid, response: search success');
                    }
                    catch (e) {
                        try {
                            yield this.bot.sendChatAction(chatid, 'upload_photo');
                            response = yield this.helper.image(match[1]);
                            yield this.bot.sendPhoto(chatid, response.img, {
                                reply_markup: {
                                    inline_keyboard: [[{
                                                text: temp.text('command.img.visit_page'),
                                                url: response.url
                                            }, {
                                                text: temp.text('command.img.view_image'),
                                                url: response.img
                                            }], [{
                                                text: temp.text('command.img.another'),
                                                switch_inline_query_current_chat: 'img ' + match[1]
                                            }]]
                                },
                                reply_to_message_id: msg.message_id
                            });
                            this.logger.info('command: chat_image, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + type + ', type: valid, response: search success');
                        }
                        catch (e) {
                            this.logger.error('command: chat_image chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + type + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                }
            }
            catch (e) {
                this.logger.error('command: chat_image chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + type + ', type: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = ChatImage;

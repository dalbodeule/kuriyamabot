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
class MessageJoin extends moduleBase_1.message {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                return;
            if (!msg.new_chat_members)
                return;
            const chatid = msg.chat.id;
            try {
                this.logger.info('message: chat join, chatid: ' + chatid +
                    ', userid: ' + msg.new_chat_members[0].id + ', status: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'typing'),
                    this.helper.getlang(msg, this.logger)
                ]);
                if (msg.new_chat_members[0].id !== this.config.bot.id) {
                    let value = yield this.model.message.findWelcome(chatid);
                    if (!value) {
                        yield this.bot.sendMessage(chatid, temp.text('message.join')
                            .replace(/{roomid}/g, msg.chat.title)
                            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
                            reply_to_message_id: msg.message_id
                        });
                    }
                    else if (value.welcomeMessage === 'off') {
                    }
                    else {
                        let welcomeMessage = value.welcomeMessage || temp.text('message.join');
                        yield this.bot.sendMessage(chatid, welcomeMessage
                            .replace(/{roomid}/g, msg.chat.title)
                            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
                            reply_to_message_id: msg.message_id
                        });
                    }
                    this.logger.info('message: chat join, chatid: ' + chatid +
                        ', userid: ' + msg.new_chat_members[0].id + ', status: success');
                }
                else {
                    yield this.bot.sendChatAction(chatid, 'typing');
                    yield this.bot.sendMessage(chatid, '👋 ' + temp.text('message.botjoin'));
                    this.logger.info('message: chat join, chatid: ' + chatid +
                        ', i\'m join room!, status: success');
                }
            }
            catch (e) {
                this.logger.error('message: chat join, chatid: ' + chatid +
                    ', userid: ' + msg.new_chat_members[0].id + ', status: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = MessageJoin;

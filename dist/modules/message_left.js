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
class MessageLeft extends moduleBase_1.message {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                return;
            if (!msg.left_chat_member)
                return;
            const chatid = msg.chat.id;
            try {
                this.logger.info('message: chat left, chatid: ' + chatid +
                    ', userid: ' + msg.left_chat_member.id + 'status: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'typing'),
                    this.helper.getlang(msg, this.logger)
                ]);
                if (msg.left_chat_member.id !== this.config.bot.id) {
                    let value = yield this.model.message.findLeave(chatid);
                    if (!value) {
                        yield this.bot.sendMessage(chatid, temp.text('message.left')
                            .replace(/{roomid}/g, msg.chat.title)
                            .replace(/{userid}/g, msg.left_chat_member.first_name), {
                            reply_to_message_id: msg.message_id
                        });
                    }
                    else if (value.leaveMessage === 'off') {
                    }
                    else {
                        value = value.get({ plain: true });
                        let leaveMessage = value.leaveMessage || temp.text('message.left');
                        yield this.bot.sendMessage(chatid, leaveMessage
                            .replace(/{roomid}/g, msg.chat.title)
                            .replace(/{userid}/g, msg.left_chat_member.first_name), {
                            reply_to_message_id: msg.message_id
                        });
                    }
                    this.logger.info('message: chat left, chatid: ' + chatid +
                        ', userid: ' + msg.left_chat_member.id + 'status: success');
                }
                else {
                    this.logger.info('message: chat left, chatid: ' + chatid +
                        ', I\'m has left, status: success');
                }
            }
            catch (e) {
                this.logger.error('message: chat left, chatid: ' + chatid +
                    ', userid: ' + msg.left_chat_member.id + ' status: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = MessageLeft;

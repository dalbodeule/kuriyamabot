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
        this.regexp = new RegExp('^/welcome+(?:@' +
            this.config.bot.username + ')? ([^\r]+)$');
    }
    module(msg, match) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
                const chatid = msg.chat.id;
                try {
                    this.logger.info('command: welcome, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: pending');
                    let isAdmin, send, temp, admins;
                    [send, temp, admins] = yield Promise.all([
                        this.bot.sendChatAction(chatid, 'typing'),
                        this.helper.getlang(msg, this.logger),
                        this.bot.getChatAdministrators(chatid)
                    ]);
                    if (msg.chat.type === 'private') {
                        yield this.bot.sendMessage(chatid, '❗️ ' +
                            temp.text('command.isnotgroup'));
                        this.logger.info('command: welcome, chatid: ' + chatid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.text + ', type: is not group');
                    }
                    else {
                        isAdmin = admins.some((v) => {
                            return v.user.id === msg.from.id;
                        });
                        if (!isAdmin) {
                            yield this.bot.sendMessage(chatid, '❗️ ' +
                                temp.text('command.lowPermission'));
                            this.logger.info('command: welcome, chatid: ' + chatid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.text + ', type: low Permission');
                        }
                        else {
                            let value = yield this.model.message.findWelcome(chatid);
                            if (!value) {
                                yield this.model.message.createWelcome(chatid, match[1]);
                                yield this.bot.sendMessage(chatid, ' ' +
                                    temp.text('command.welcome.success'), {
                                    reply_to_message_id: msg.message_id
                                });
                                this.logger.info('command: welcome, chatid: ' + chatid +
                                    ', username: ' + this.helper.getuser(msg.from) +
                                    ', command: ' + msg.text + ', type: create success');
                            }
                            else {
                                if (value && !value.welcomeMessage) {
                                    yield this.model.message.updateLeave(chatid, match[1]);
                                    yield this.bot.sendMessage(chatid, ' ' +
                                        temp.text('command.welcome.success'), {
                                        reply_to_message_id: msg.message_id
                                    });
                                    this.logger.info('command: welcome, chatid: ' + chatid +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.text + ', type: update success');
                                }
                                else {
                                    yield this.model.message.updateWelcome(chatid, match[1]);
                                    yield this.bot.sendMessage(chatid, ' ' +
                                        temp.text('command.welcome.success'), {
                                        reply_to_message_id: msg.message_id
                                    });
                                    this.logger.info('command: welcome, chatid: ' + chatid +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.text + ', type: update success');
                                }
                            }
                        }
                    }
                }
                catch (e) {
                    this.logger.error('command: welcome, chatid: ' + chatid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.text + ', type: error');
                    this.logger.debug(e.stack);
                }
            }
        });
    }
}
exports.default = ChatImage;

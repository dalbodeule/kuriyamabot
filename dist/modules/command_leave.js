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
const model = require("../db");
const helper_1 = require("../helper");
const config_1 = require("../config");
exports.default = (bot, logger) => {
    bot.onText(new RegExp('^/leave+(?:@' + config_1.default.botinfo.username + ')? ([^\r]+)$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
        if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
            const chatid = msg.chat.id;
            let temp;
            try {
                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received');
                let send, admins, isAdmin = false;
                [send, temp, admins] = yield Promise.all([
                    bot.sendChatAction(chatid, 'typing'),
                    helper_1.default.getlang(msg, logger),
                    bot.getChatAdministrators(chatid)
                ]);
                if (msg.chat.type === 'private') {
                    yield bot.sendMessage(chatid, '❗️ ' + temp.text('command.isnotgroup'));
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup');
                }
                else {
                    isAdmin = admins.some((v) => {
                        return v.user.id === msg.from.id;
                    });
                    if (!isAdmin) {
                        yield bot.sendMessage(chatid, '❗️ ' + temp.text('command.lowPermission'));
                        logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: lowPermission');
                    }
                    else {
                        let value = yield model.message.findLeave(chatid);
                        if (!value) {
                            yield model.message.createLeave(chatid, match[1]);
                            yield bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                                reply_to_message_id: msg.message_id
                            });
                            logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: create success');
                        }
                        else {
                            if (value && !value.leaveMessage) {
                                yield model.message.updateLeave(chatid, match[1]);
                                yield bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                                    reply_to_message_id: msg.message_id
                                });
                                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: update success');
                            }
                            else {
                                yield model.message.updateLeave(chatid, match[1]);
                                yield bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                                    reply_to_message_id: msg.message_id
                                });
                                logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: update success');
                            }
                        }
                    }
                }
            }
            catch (e) {
                logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error');
                logger.debug(e.stack);
            }
        }
    }));
    bot.onText(new RegExp('^/leave+(?:@' + global.botinfo.username + ')? ?$'), (msg, match) => __awaiter(this, void 0, void 0, function* () {
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
                if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
                    yield bot.sendMessage(chatid, '❗️ ' + temp.text('command.isnotgroup'));
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup');
                }
                else {
                    yield bot.sendMessage(chatid, '🔧 ' + temp.text('command.leave.help'), {
                        reply_to_message_id: msg.message_id,
                        parse_mode: 'Markdown'
                    });
                    logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid,');
                }
            }
            catch (e) {
                logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error');
                logger.debug(e.stack);
            }
        }
    }));
};

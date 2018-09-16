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
class CallbackChangeLang extends moduleBase_1.callback {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let test = msg.data.match(/changelang_([a-zA-Z]{2})/);
            if (test) {
                const callid = msg.id;
                try {
                    let temp;
                    this.logger.info('callback: change_lang, callback id: ' + callid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.data + ', type: pending');
                    if (msg.message.chat.type === 'private') {
                        temp = yield this.helper.getlang(msg, this.logger);
                        yield temp.langset(test[1]);
                        yield this.bot.editMessageText(temp.text('command.lang.success'), { chat_id: msg.message.chat.id,
                            message_id: msg.message.message_id,
                            parse_mode: 'HTML'
                        });
                        this.logger.info('callback: change_lang, callback id: ' + callid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.data + ', type: valid');
                    }
                    else {
                        let admins, isAdmin = false;
                        [temp, admins] = yield Promise.all([
                            this.helper.getlang(msg, this.logger),
                            this.bot.getChatAdministrators(msg.message.chat.id)
                        ]);
                        isAdmin = admins.some((v) => {
                            return v.user.id === msg.from.id;
                        });
                        if (isAdmin) {
                            temp = yield this.helper.getlang(msg, this.logger);
                            yield temp.langset(test[1]);
                            yield this.bot.editMessageText(temp.text('command.lang.success'), {
                                chat_id: msg.message.chat.id,
                                message_id: msg.message.message_id,
                                parse_mode: 'HTML'
                            });
                            this.logger.info('callback: change_lang callback id: ' + callid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.data + ', type: group valid');
                        }
                        else {
                            yield this.bot.editMessageText(temp.text('command.lowPermission'), {
                                chat_id: msg.message.chat.id,
                                message_id: msg.message.message_id,
                                parse_mode: 'HTML'
                            });
                            this.logger.info('callback: change_lang callback id: ' + callid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.data + ', type: group lowPermission');
                        }
                    }
                }
                catch (e) {
                    this.logger.error('callback: change_lang callback id: ' + callid +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.data + ', type: error');
                    this.logger.debug(e);
                }
            }
        });
    }
}
exports.default = CallbackChangeLang;

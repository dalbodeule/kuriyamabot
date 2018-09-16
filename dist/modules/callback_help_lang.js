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
class CallbackHelpHelp extends moduleBase_1.callback {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = (msg, temp) => {
                this.bot.answerCallbackQuery(msg.id, {
                    text: temp.text('command.help.twice')
                });
            };
            const callid = msg.id;
            try {
                let temp = yield this.helper.getlang(msg, this.logger);
                if (msg.data === 'help_lang') {
                    if (msg.message.text !== '🔤 ' + temp.help('command.help.lang')) {
                        this.logger.info('callback: help_lang, callback id: ' + callid +
                            ', username: ' + this.helper.getuser(msg.from) +
                            ', command: ' + msg.data + ', type: pending');
                        try {
                            yield this.bot.editMessageText('🔤 ' + temp.help('command.help.lang'), {
                                chat_id: msg.message.chat.id,
                                message_id: msg.message.message_id,
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: this.helper.commandlist(temp)
                                }
                            });
                            this.logger.info('callback: help_lang, callback id: ' + callid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.data + ', type: success');
                        }
                        catch (e) {
                            this.logger.error('callback: help_lang, callback id: ' + callid +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.data + ', type: error');
                            this.logger.debug(e);
                        }
                    }
                    else {
                        answer(msg, temp);
                    }
                }
            }
            catch (e) {
                this.logger.error('callback: help_lang, callback id: ' + callid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    'command: ' + msg.data + ', type: error');
                this.logger.debug(e);
            }
        });
    }
}
exports.default = CallbackHelpHelp;

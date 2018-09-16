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
class InlineHelp extends moduleBase_1.inline {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = {
                id: msg.id, query: msg.query
            };
            const match = q.query.match(/^(?:([help]+)(?:| (.*)+))$/);
            if (match) {
                try {
                    this.logger.info('inline: help, inlineid: ' + q.id +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.query + ', type: pending');
                    let temp = yield this.helper.getlang(msg, this.logger);
                    yield this.bot.answerInlineQuery(q.id, [{
                            type: 'article',
                            title: 'help message',
                            id: 'help',
                            input_message_content: {
                                message_text: temp.inline('command.help.help.name') + '\n\n' +
                                    '🖼 ' + temp.inline('command.help.img.name') + '\n\n' +
                                    '🔍 ' + temp.inline('command.help.search.name') + '\n\n' +
                                    '⚙️ ' + temp.inline('tobot'),
                                parse_mode: 'HTML'
                            },
                            reply_markup: {
                                inline_keyboard: [[{
                                            text: '🖼',
                                            switch_inline_query_current_chat: 'img'
                                        }, {
                                            text: '🔍',
                                            switch_inline_query_current_chat: 'search'
                                        }], [{
                                            text: '⚙️',
                                            url: 'https://t.me/' + this.config.bot.username
                                        }]]
                            }
                        }], {
                        cache_time: 3
                    });
                    this.logger.info('inline: help, inlineid: ' + q.id +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.query + ', type: success');
                }
                catch (e) {
                    this.logger.error('inline: help, inlineid: ' + q.id +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.query + ', type: error');
                    this.logger.debug(e.stack);
                }
            }
        });
    }
}
exports.default = InlineHelp;

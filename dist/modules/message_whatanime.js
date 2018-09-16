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
const whatanimega_helper_1 = require("whatanimega-helper");
const timeFormat_1 = require("../helper/timeFormat");
class MessageWhatanime extends moduleBase_1.message {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex1 = new RegExp('^(?:무슨 ?애니\??|whatanime|anime|/(?:무슨애니|whatanime)+(?:@' +
                this.config.bot.username + ')? ?)$');
            const regex2 = new RegExp('/(?:무슨애니|whatanime)+(?:@' +
                this.config.bot.username + ')? ?$');
            try {
                if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                    return;
                if (msg.photo) {
                    if (regex1.test(msg.caption)) {
                        yield this.success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id);
                        return;
                    }
                    else if (msg.reply_to_message && msg.reply_to_message.from &&
                        msg.reply_to_message.from.username === this.config.bot.username &&
                        msg.reply_to_message.text &&
                        msg.reply_to_message.text.match(/📺❗️/)) {
                        yield this.success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id);
                        return;
                    }
                }
                else if (msg.video && msg.document.thumb) {
                    if (regex1.test(msg.caption)) {
                        yield this.success(msg.chat.id, msg, msg.document.thumb.file_id);
                        return;
                    }
                    else if (msg.reply_to_message && msg.reply_to_message.from &&
                        msg.reply_to_message.from.username === this.config.bot.username &&
                        msg.reply_to_message.text &&
                        msg.reply_to_message.text.match(/📺❗️/)) {
                        yield this.success(msg.chat.id, msg, msg.document.thumb.file_id);
                        return;
                    }
                }
                else {
                    if (regex1.test(msg.text)) {
                        if (msg.reply_to_message && msg.reply_to_message.photo) {
                            yield this.success(msg.chat.id, msg, msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1]
                                .file_id);
                            return;
                        }
                        else if (msg.reply_to_message && msg.reply_to_message.document &&
                            msg.reply_to_message.document.thumb) {
                            yield this.success(msg.chat.id, msg, msg.reply_to_message.document.
                                thumb.file_id);
                            return;
                        }
                        else if (msg.reply_to_message && msg.reply_to_message.video) {
                            yield this.success(msg.chat.id, msg, msg.reply_to_message.video
                                .thumb.file_id);
                            return;
                        }
                    }
                    else if (regex2.test(msg.text)) {
                        yield this.failure(msg.chat.id, msg);
                        return;
                    }
                }
            }
            catch (e) {
                this.logger.error('message: whatanime, chatid: ' + msg.chat.id +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: error');
                this.logger.debug(e.stack);
            }
        });
    }
    failure(chatid, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.info('message: whatanime, chatid: ' + msg.chat.id +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: failure');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'typing'),
                    this.helper.getlang(msg, this.logger)
                ]);
                yield this.bot.sendMessage(chatid, '📺❗️ ' + temp.text('command.whatanime.info'), {
                    reply_to_message_id: msg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        force_reply: true, selective: true
                    }
                });
                this.logger.info('message: whatanime, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: failure send success');
            }
            catch (e) {
                this.logger.error('message: whatanime, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: failure send error');
                this.logger.debug(e.stack);
            }
        });
    }
    success(chatid, msg, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = new whatanimega_helper_1.default(this.config.apiKey.whatanime);
            try {
                this.logger.info('message: whatanime, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: pending');
                let [send, temp] = yield Promise.all([
                    this.bot.sendChatAction(chatid, 'typing'),
                    this.helper.getlang(msg, this.logger)
                ]);
                const url = yield this.bot.getFileLink(photo);
                const response = yield query.search(url);
                const result = response.docs[0];
                let resultMessage = '';
                if (result.title_native.toLowerCase() !==
                    result.title_english.toLowerCase()) {
                    resultMessage = temp.text('command.whatanime.name') +
                        ': <code>' + result.title_native + '</code>\n' +
                        temp.text('command.whatanime.english') + ': <code>'
                        + result.title_english + '</code>\n';
                }
                else {
                    resultMessage = temp.text('command.whatanime.name') +
                        ': <code>' + result.title_native + '</code>\n';
                }
                const time = new timeFormat_1.default(result.at);
                resultMessage = resultMessage +
                    temp.text('command.whatanime.episode') + ' <code>'
                    + result.episode + '</code>\n' +
                    temp.text('command.whatanime.time') + ': <code>' +
                    (time.hour === '00' ? '' : time.hour + ' : ') +
                    time.min + ' : ' + time.sec + '</code>\n' +
                    temp.text('command.whatanime.match') + ': <code>' +
                    (result.similarity * 100).toFixed(2) + '%</code>';
                if (result.similarity < 0.9) {
                    resultMessage = resultMessage + '\n\n<b>' +
                        temp.text('command.whatanime.incorrect') + '</b>';
                }
                if (result.is_adult) {
                    resultMessage = resultMessage + '\n\n<b>' +
                        temp.text('command.whatanime.isAdult') + '</b>';
                    yield this.bot.sendMessage(chatid, resultMessage, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: msg.message_id
                    });
                }
                else {
                    const animeVideo = yield query.previewVideo(result.anilist_id, result.filename, result.at, result.tokenthumb);
                    yield Promise.all([
                        this.bot.sendMessage(chatid, resultMessage, {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: msg.message_id
                        }),
                        this.bot.sendVideo(chatid, animeVideo, {
                            reply_to_message_id: msg.message_id
                        })
                    ]);
                }
                this.logger.info('message: whatanime, chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: success');
            }
            catch (e) {
                this.logger.error('chatid: ' + chatid +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: whatanime, type: error');
                this.logger.debug(e.stack);
            }
        });
    }
}
exports.default = MessageWhatanime;

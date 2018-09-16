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
const helper_1 = require("../helper");
const whatanimega_helper_1 = require("whatanimega-helper");
const timeFormat_1 = require("../helper/timeFormat");
exports.default = (bot, logger) => {
    const query = new whatanimega_helper_1.default(global.config.apikey.whatanime);
    const failure = (chatid, msg) => __awaiter(this, void 0, void 0, function* () {
        let temp;
        try {
            let send;
            [send, temp] = yield Promise.all([
                bot.sendChatAction(chatid, 'typing'),
                helper_1.default.getlang(msg, logger)
            ]);
            yield bot.sendMessage(chatid, '📺❗️ ' + temp.text('command.whatanime.info'), {
                reply_to_message_id: msg.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true, selective: true
                }
            });
            logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: valid,');
        }
        catch (e) {
            logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error');
            logger.debug(e.stack);
        }
    });
    const success = (chatid, msg, photo) => __awaiter(this, void 0, void 0, function* () {
        let temp;
        try {
            logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: command received');
            let send;
            [send, temp] = yield Promise.all([
                bot.sendChatAction(chatid, 'typing'),
                helper_1.default.getlang(msg, logger)
            ]);
            const url = yield bot.getFileLink(photo);
            const response = yield query.search(url);
            const result = response.docs[0];
            let resultMessage = '';
            if (result.anime.toLowerCase() !== result.title_english.toLowerCase()) {
                resultMessage = temp.text('command.whatanime.name') + ': <code>' + result.title_native + '</code>\n' +
                    temp.text('command.whatanime.english') + ': <code>' + result.title_english + '</code>\n';
            }
            else {
                resultMessage = temp.text('command.whatanime.name') + ': <code>' + result.title_native + '</code>\n';
            }
            const time = new timeFormat_1.default(result.at);
            resultMessage = resultMessage +
                temp.text('command.whatanime.episode') + ' <code>' + result.episode + '</code>\n' +
                temp.text('command.whatanime.time') + ': <code>' +
                (time.hour === '00' ? '' : time.hour + ' : ') + time.min + ' : ' + time.sec + '</code>\n' +
                temp.text('command.whatanime.match') + ': <code>' + (result.similarity * 100).toFixed(2) + '%</code>';
            if (result.similarity < 0.9) {
                resultMessage = resultMessage + '\n\n<b>' + temp.text('command.whatanime.incorrect') + '</b>';
            }
            if (result.is_adult) {
                resultMessage = resultMessage + '\n\n<b>' + temp.text('command.whatanime.isAdult') + '</b>';
                yield bot.sendMessage(chatid, resultMessage, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: msg.message_id
                });
            }
            else {
                const animeVideo = yield query.previewVideo(result.season, result.anime, result.filename, result.at, result.tokenthumb);
                yield Promise.all([
                    bot.sendMessage(chatid, resultMessage, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: msg.message_id
                    }),
                    bot.sendVideo(chatid, animeVideo, {
                        reply_to_message_id: msg.message_id
                    })
                ]);
            }
            logger.info('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: valid');
        }
        catch (e) {
            logger.error('chatid: ' + chatid + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error');
            logger.debug(e.stack);
        }
    });
    bot.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
        const regex1 = new RegExp('^(?:무슨 ?애니|whatanime|anime|/(?:무슨애니|whatanime)+(?:@' + global.botinfo.username + ')? ?)$');
        const regex2 = new RegExp('/(?:무슨애니|whatanime)+(?:@' + global.botinfo.username + ')? ?$');
        try {
            if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180)
                return;
            if (msg.photo) {
                if (regex1.test(msg.caption)) {
                    yield success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id);
                    return;
                }
                else if (msg.reply_to_message && msg.reply_to_message.from &&
                    msg.reply_to_message.from.username === global.botinfo.username &&
                    msg.reply_to_message.text &&
                    msg.reply_to_message.text.match(/📺❗️/)) {
                    yield success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id);
                    return;
                }
            }
            else if (msg.video && msg.document.thumb) {
                if (regex1.test(msg.caption)) {
                    yield success(msg.chat.id, msg, msg.document.thumb.file_id);
                    return;
                }
                else if (msg.reply_to_message && msg.reply_to_message.from &&
                    msg.reply_to_message.from.username === global.botinfo.username &&
                    msg.reply_to_message.text &&
                    msg.reply_to_message.text.match(/📺❗️/)) {
                    yield success(msg.chat.id, msg, msg.document.thumb.file_id);
                    return;
                }
            }
            else {
                if (regex1.test(msg.text)) {
                    if (msg.reply_to_message && msg.reply_to_message.photo) {
                        yield success(msg.chat.id, msg, msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id);
                        return;
                    }
                    else if (msg.reply_to_message && msg.reply_to_message.document && msg.reply_to_message.document.thumb) {
                        yield success(msg.chat.id, msg, msg.reply_to_message.document.thumb.file_id);
                        return;
                    }
                    else if (msg.reply_to_message && msg.reply_to_message.video && msg.reply_to_message.document.video) {
                        yield success(msg.chat.id, msg, msg.reply_to_message.video.thumb.file_id);
                        return;
                    }
                }
                else if (regex2.test(msg.text)) {
                    yield failure(msg.chat.id, msg);
                    return;
                }
            }
        }
        catch (e) {
            logger.error('chatid: ' + msg.chat.id + ', username: ' + helper_1.default.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error');
            logger.debug(e.stack);
        }
    }));
};

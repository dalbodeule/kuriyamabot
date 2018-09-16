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
const google = require("google-parser");
class InlineImage extends moduleBase_1.inline {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = {
                id: msg.id, query: msg.query
            };
            function removeMatching(originalArray, regex) {
                let j = 0;
                while (j < originalArray.length) {
                    if (regex.test(originalArray[j].img)) {
                        originalArray.splice(j, 1);
                    }
                    else {
                        j++;
                    }
                }
                return originalArray;
            }
            const match = q.query
                .match(/^(?:([photo|image|img|짤|사진|이미지]+)(?:| (.*)+))$/);
            if (match) {
                this.logger.info('inline: image, inlineid: ' + q.id +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.query + ', type: pending');
                try {
                    let temp = yield this.helper.getlang(msg, this.logger);
                    if (typeof match[2] === 'undefined' || match[2] === '') {
                        try {
                            yield this.bot.answerInlineQuery(q.id, [{
                                    type: 'article',
                                    title: '@' + this.config.bot.username + ' (photo|image|img) (keyword)',
                                    id: 'help',
                                    input_message_content: {
                                        message_text: '@' + this.config.bot.username + ' (photo|image|img) (keyword)',
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true
                                    },
                                    reply_markup: {
                                        inline_keyboard: [[{
                                                    text: '🖼',
                                                    switch_inline_query_current_chat: 'img '
                                                }]]
                                    }
                                }], {
                                cache_time: 3
                            });
                            this.logger.info('inline: image, inlineid: ' + q.id +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.query + ', type: success, response: help');
                        }
                        catch (e) {
                            this.logger.error('inline: image, inlineid: ' + q.id +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.query + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                    else {
                        try {
                            let res = yield google.img(match[2]);
                            if (typeof res[0] === 'undefined') {
                                try {
                                    yield this.bot.answerInlineQuery(q.id, [{
                                            type: 'article',
                                            title: temp.text('command.img.not_found'),
                                            id: 'not found',
                                            input_message_content: {
                                                message_text: temp.inline('command.img.not_found'),
                                                parse_mode: 'HTML',
                                                disable_web_page_preview: true
                                            }
                                        }], {
                                        cache_time: 3
                                    });
                                    this.logger.info('inline: image, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: success, response: not found');
                                }
                                catch (e) {
                                    this.logger.error('inline: image, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: error');
                                    this.logger.debug(e.stack);
                                }
                            }
                            else {
                                res.splice(50);
                                res = removeMatching(res, /^x-raw-image:\/\/\/.*$/);
                                let results = [];
                                for (let i in res) {
                                    results.push({
                                        type: 'photo',
                                        photo_url: res[i].img,
                                        thumb_url: res[i].img,
                                        id: q.id + '/photo/' + i,
                                        reply_markup: {
                                            inline_keyboard: [[{
                                                        text: temp.inline('command.img.visit_page'),
                                                        url: res[i].url
                                                    }, {
                                                        text: temp.inline('command.img.view_image'),
                                                        url: res[i].img
                                                    }],
                                                [{
                                                        text: temp.inline('command.img.another'),
                                                        switch_inline_query_current_chat: 'img ' + match[2]
                                                    }]]
                                        }
                                    });
                                }
                                try {
                                    yield this.bot.answerInlineQuery(q.id, results, {
                                        cache_time: 3
                                    });
                                    this.logger.info('inline: image, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: success');
                                }
                                catch (e) {
                                    try {
                                        this.logger.error('inline: image, inlineid: ' + q.id +
                                            ', username: ' + this.helper.getuser(msg.from) +
                                            ', command: ' + msg.query + ', type: error');
                                        this.logger.debug(e.stack);
                                        yield this.bot.answerInlineQuery(q.id, [{
                                                type: 'article',
                                                title: temp.text('command.img.error')
                                                    .replace(/{botid}/g, '@' + this.config.bot.username)
                                                    .replace(/{keyword}/g, match[2]),
                                                id: 'error',
                                                input_message_content: {
                                                    message_text: temp.inline('command.img.error')
                                                        .replace(/{botid}/g, '@' + this.config.bot.username)
                                                        .replace(/{keyword}/g, match[2]),
                                                    parse_mode: 'HTML',
                                                    disable_web_page_prefiew: true
                                                },
                                                reply_markup: {
                                                    inline_keyboard: [[{
                                                                text: '@' + this.config.bot.username + ' img ' + match[2],
                                                                switch_inline_query_current_chat: 'img ' + match[2]
                                                            }]]
                                                }
                                            }], {
                                            cache_time: 0
                                        });
                                    }
                                    catch (e) {
                                        this.logger.error('inline: image, inlineid: ' + q.id +
                                            ', username: ' + this.helper.getuser(msg.from) +
                                            ', command: ' + msg.query + ', type: error');
                                        this.logger.debug(e.stack);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            try {
                                this.logger.error('inline: image, inlineid: ' + q.id +
                                    ', username: ' + this.helper.getuser(msg.from) +
                                    ', command: ' + msg.query + ', type: error');
                                this.logger.debug(e.stack);
                                yield this.bot.answerInlineQuery(q.id, [{
                                        type: 'article',
                                        title: temp.text('command.img.error')
                                            .replace(/{botid}/g, '@' + this.config.bot.username)
                                            .replace(/{keyword}/g, match[2]),
                                        id: 'error',
                                        input_message_content: {
                                            message_text: temp.inline('command.img.error')
                                                .replace(/{botid}/g, '@' + this.config.bot.username)
                                                .replace(/{keyword}/g, match[2]),
                                            parse_mode: 'HTML',
                                            disable_web_page_prefiew: true
                                        },
                                        reply_markup: {
                                            inline_keyboard: [[{
                                                        text: '@' + this.config.bot.username + ' img ' + match[2],
                                                        switch_inline_query_current_chat: 'img ' + match[2]
                                                    }]]
                                        }
                                    }], {
                                    cache_time: 0
                                });
                            }
                            catch (e) {
                                this.logger.error('inline: image, inlineid: ' + q.id +
                                    ', username: ' + this.helper.getuser(msg.from) +
                                    ', command: ' + msg.query + ', type: error');
                                this.logger.debug(e.stack);
                            }
                        }
                    }
                }
                catch (e) {
                    this.logger.error('inline: image, inlineid: ' + q.id +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.query + ', type: error');
                    this.logger.debug(e.stack);
                }
            }
        });
    }
}
exports.default = InlineImage;

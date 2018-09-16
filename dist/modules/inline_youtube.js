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
class InlineSearch extends moduleBase_1.inline {
    constructor(bot, logger, config) {
        super(bot, logger, config);
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = {
                id: msg.id, query: msg.query
            };
            function getdesc(description, url, title, temp) {
                let shot = url.toString().match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/watch\?v=+([^&]+)/);
                if (shot !== null) {
                    return 'https://youtu.be/' + shot[1];
                }
                else if (description === '') {
                    return temp.text('command.search.desc_null');
                }
                else {
                    if (description.length > 27) {
                        description = description.substr(0, 30) + '...'.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
                    }
                    return description;
                }
            }
            const match = q.query
                .match(/^(?:([youtube|yt|유튜브]+)(?:| (.*)+))$/);
            if (match) {
                this.logger.info('inline: youtube, inlineid: ' + q.id +
                    ', username: ' + this.helper.getuser(msg.from) +
                    ', command: ' + msg.query + ', type: pending');
                try {
                    let temp = yield this.helper.getlang(msg + ' site:youtube.com', this.logger);
                    if (typeof match[2] === 'undefined' || match[2] === '') {
                        try {
                            yield this.bot.answerInlineQuery(q.id, [{
                                    type: 'article',
                                    title: '@' + this.config.bot.username + ' (youtube|yt) (keyword)',
                                    id: 'help',
                                    input_message_content: {
                                        message_text: '@' + this.config.bot.username + ' (youtube|yt) (keyword)', parse_mode: 'HTML', disable_web_page_preview: true
                                    },
                                    reply_markup: {
                                        inline_keyboard: [[{
                                                    text: '🔍',
                                                    switch_inline_query_current_chat: 'youtube '
                                                }]]
                                    }
                                }], {
                                cache_time: 3
                            });
                            this.logger.info('inline: youtube, inlineid: ' + q.id +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.query + ', type: success, responseponse: help');
                        }
                        catch (e) {
                            this.logger.error('inline: youtube, inlineid: ' + q.id +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.query + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                    else {
                        try {
                            let response = yield google.search(match[2]);
                            if (response.reson == 'antibot') {
                                try {
                                    yield this.bot.answerInlineQuery(q.id, [{
                                            type: 'article',
                                            title: temp.text('command.search.bot_blcok'),
                                            id: 'google bot block',
                                            input_message_content: {
                                                message_text: temp.inline('command.search.bot_blcok'), parse_mode: 'HTML', disable_web_page_preview: true
                                            }
                                        }], {
                                        cache_time: 3
                                    });
                                    this.logger.info('inline: youtube, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: valid, response: google bot block');
                                }
                                catch (e) {
                                    this.logger.error('inline: youtube, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: error');
                                    this.logger.debug(e.stack);
                                }
                            }
                            else if (!response[0]) {
                                try {
                                    yield this.bot.answerInlineQuery(q.id, [{
                                            type: 'article',
                                            title: temp.text('command.search.not_found'),
                                            id: 'not found',
                                            input_message_content: {
                                                message_text: temp.inline('command.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                                            }
                                        }], {
                                        cache_time: 3
                                    });
                                    this.logger.info('inline: youtube, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: valid, response: not found');
                                }
                                catch (e) {
                                    this.logger.error('inline: youtube, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: error');
                                    this.logger.debug(e.stack);
                                }
                            }
                            else {
                                response.splice(50);
                                let responseults = [];
                                let i = 0;
                                for (i in response) {
                                    responseults.push({
                                        type: 'article',
                                        title: response[i].title,
                                        id: q.id + '/document/' + i,
                                        input_message_content: {
                                            message_text: getdesc(response[i].description, response[i].link, response[i].title, temp),
                                            parse_mode: 'HTML'
                                        },
                                        reply_markup: {
                                            inline_keyboard: [[{
                                                        text: temp.inline('command.search.visit_page'),
                                                        url: response[i].link
                                                    }, {
                                                        text: temp.inline('command.search.another'),
                                                        switch_inline_query_current_chat: 'search ' + match[2]
                                                    }]]
                                        }
                                    });
                                }
                                try {
                                    yield this.bot.answerInlineQuery(q.id, responseults, {
                                        cache_time: 3
                                    });
                                    this.logger.info('inline: youtube, inlineid: ' + q.id +
                                        ', username: ' + this.helper.getuser(msg.from) +
                                        ', command: ' + msg.query + ', type: valid');
                                }
                                catch (e) {
                                    try {
                                        yield this.bot.answerInlineQuery(q.id, [{
                                                type: 'article',
                                                title: temp.text('command.search.error')
                                                    .replace(/{botid}/g, '@' + this.config.bot.username)
                                                    .replace(/{keyword}/g, match[2]),
                                                id: 'error',
                                                input_message_content: {
                                                    message_text: temp.inline('command.search.error')
                                                        .replace(/{botid}/g, '@' + this.config.bot.username)
                                                        .replace(/{keyword}/g, match[2]),
                                                    parse_mode: 'HTML',
                                                    disable_web_page_preview: true
                                                }
                                            }], {
                                            cache_time: 3
                                        });
                                        this.logger.error('inline: youtube, inlineid: ' + q.id +
                                            ', username: ' + this.helper.getuser(msg.from) +
                                            ', command: ' + msg.query + ', type: error');
                                        this.logger.debug(e.stack);
                                    }
                                    catch (e) {
                                        this.logger.error('inline: youtube, inlineid: ' + q.id +
                                            ', username: ' + this.helper.getuser(msg.from) +
                                            ', command: ' + msg.query + ', type: error send error');
                                        this.logger.debug(e.stack);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            yield this.bot.answerInlineQuery(q.id, [{
                                    type: 'article',
                                    title: temp.text('command.search.error')
                                        .replace(/{botid}/g, '@' + this.config.bot.username)
                                        .replace(/{keyword}/g, match[2]),
                                    id: 'error',
                                    input_message_content: {
                                        message_text: temp.inline('command.search.error')
                                            .replace(/{botid}/g, '@' + this.config.bot.username)
                                            .replace(/{keyword}/g, match[2]),
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true
                                    }
                                }], {
                                cache_time: 3
                            });
                            this.logger.error('inline: youtube, inlineid: ' + q.id +
                                ', username: ' + this.helper.getuser(msg.from) +
                                ', command: ' + msg.query + ', type: error');
                            this.logger.debug(e.stack);
                        }
                    }
                }
                catch (e) {
                    this.logger.error('inline: youtube, inlineid: ' + q.id +
                        ', username: ' + this.helper.getuser(msg.from) +
                        ', command: ' + msg.query + ', type: error');
                    this.logger.debug(e.stack);
                }
            }
        });
    }
}
exports.default = InlineSearch;

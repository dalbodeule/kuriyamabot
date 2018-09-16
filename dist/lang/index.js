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
const objectPath = require("object-path");
const language = require("languages");
const model = require("../db");
const glob = require("glob-promise");
const path = require("path");
const config_1 = require("../config");
const langs = {};
class default_1 {
    constructor(logger) {
        this.id = 0;
        this.lang = '';
        this.logger = logger;
        this.ready = false;
    }
    set(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(langs).length === 0) {
                this.logger.info('Language: Language not loaded');
                let items = yield glob(path.join(__dirname, '..', '..', 'language', 'lang_*.json'));
                for (let i of items) {
                    let temp = require(i);
                    langs[temp.lang.langname] = temp;
                    this.logger.info('Language: "' + temp.lang.langname + '" Load complete');
                }
                this.logger.info('Language: Language load complete');
                this.ready = true;
            }
            else {
                this.ready = true;
            }
            if (msg.chat && msg.from.language_code) {
                this.id = (msg.chat.type === 'private' ?
                    msg.from.id : msg.chat.id);
                let query = yield model.language.find(this.id);
                if (!query || !query.lang) {
                    this.lang = msg.from.language_code.split('-')[0];
                    this.logger.debug(this.id + ' ' + this.lang);
                    model.language.create(this.id, this.lang);
                    return query;
                }
                else {
                    this.lang = query.lang;
                    this.logger.debug('id: ' + this.id + ', lang: ' + this.lang);
                    return query;
                }
            }
            else if (msg.message) {
                this.id = (msg.message.chat.type === 'private' ?
                    msg.from.id :
                    msg.message.chat.id);
                let query = yield model.language.find(this.id);
                if (!query || !query.lang) {
                    this.lang = msg.from.language_code.split('-')[0];
                    this.logger.debug(this.id + ' ' + this.lang);
                    model.language.create(this.id, this.lang);
                    return query;
                }
                else {
                    this.lang = query.lang;
                    this.logger.debug('id: ' + this.id + ', lang: ' + this.lang);
                    return query;
                }
            }
            else {
                this.id = msg.from.id;
                let query = yield model.language.find(this.id);
                if (!query || !query.lang) {
                    this.lang = msg.from.language_code.split('-')[0];
                    this.logger.debug(this.id + ' ' + this.lang);
                    model.language.create(this.id, this.lang);
                    return query;
                }
                else {
                    this.lang = query.lang;
                    this.logger.debug('id: ' + this.id + ', lang: ' + this.lang);
                    return query;
                }
            }
        });
    }
    langset(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            let isExist = false;
            for (let i in Object.keys(langs)) {
                if (langs[Object.keys(langs)[i]].lang.code === lang) {
                    isExist = true;
                }
            }
            if (isExist === false) {
                throw Error(lang + ' is not a valid value');
            }
            try {
                yield model.language.update(lang, this.id);
                this.lang = lang;
                this.logger.debug({ id: this.id, lang: this.lang });
                return true;
            }
            catch (e) {
                throw (e);
            }
        });
    }
    inline(code) {
        if (typeof this.lang === 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] === 'undefined') {
            return objectPath.get(langs.Korean, code) + '(' + objectPath.get(langs.English, code) + ')';
        }
        else if (language.getLanguageInfo(this.lang).name === 'English') {
            return objectPath.get(langs.English, code);
        }
        else {
            return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code) +
                '(' + objectPath.get(langs.English, code) + ')';
        }
    }
    help(code) {
        return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.name') + '\n\n' +
            objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.description') + '\n\n' +
            objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.how')
                .replace(/{botid}/g, '@' + config_1.config.bot.username);
    }
    text(code) {
        return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code);
    }
    getLangList() {
        return langs;
    }
}
exports.default = default_1;

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
const search_1 = require("./search");
const lang_1 = require("../lang");
exports.default = {
    getuser(user) {
        if (!user.username) {
            return user.first_name;
        }
        else {
            return user.username;
        }
    },
    getlang(msg, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let temp = new lang_1.default(logger);
                yield temp.set(msg);
                return temp;
            }
            catch (e) {
                throw (e);
            }
        });
    },
    commandlist(temp) {
        return [
            [{
                    text: '📒 ' + temp.inline('command.help.help.name'),
                    callback_data: 'help'
                }],
            [{
                    text: '🖼 ' + temp.inline('command.help.img.name'),
                    callback_data: 'help_image'
                }, {
                    text: '🔍 ' + temp.inline('command.help.search.name'),
                    callback_data: 'help_search'
                }],
            [{
                    text: '👋 ' + temp.inline('command.help.start.name'),
                    callback_data: 'help_start'
                }, {
                    text: '✅ ' + temp.inline('command.help.uptime.name'),
                    callback_data: 'help_uptime'
                }],
            [{
                    text: '🔤 ' + temp.inline('command.help.lang.name'),
                    callback_data: 'help_lang'
                }, {
                    text: '📟 ' + temp.inline('command.help.me.name'),
                    callback_data: 'help_me'
                }],
            [{
                    text: '📺 ' + temp.inline('command.help.whatanime.name'),
                    callback_data: 'help_whatanime'
                }, {
                    text: '👋 ' + temp.inline('command.help.welcome.name'),
                    callback_data: 'help_welcome'
                }],
            [{
                    text: '👋 ' + temp.inline('command.help.leave.name'),
                    callback_data: 'help_leave'
                }, {
                    text: '😁 ' + temp.inline('command.help.contact'),
                    url: 'https://t.me/small_sunshine'
                }]
        ];
    },
    langlist(temp) {
        let list = temp.getLangList();
        let listResult = [];
        for (let i in Object.keys(list)) {
            listResult.push(list[Object.keys(list)[i]].lang);
        }
        let result = [];
        for (let i = 0; i < listResult.length - 1; i += 2) {
            if (typeof listResult[i + 1] === 'object') {
                result.push([{
                        text: listResult[i].display,
                        callback_data: 'changelang_' + listResult[i].code
                    }, {
                        text: listResult[i + 1].display,
                        callback_data: 'changelang_' + listResult[i + 1].code
                    }]);
            }
            else {
                result.push([{
                        text: listResult[i].display,
                        callback_data: 'changelang_' + listResult[i].code
                    }]);
            }
        }
        return result;
    },
    search: search_1.default.search,
    image: search_1.default.image
};

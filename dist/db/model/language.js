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
const table_1 = require("../table");
const SUCCESS = true;
class Language {
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield table_1.default.Language.findOne({
                where: {
                    id
                },
                raw: true,
                attributes: [
                    'id',
                    'lang'
                ]
            });
            return result;
        });
    }
    static create(id, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            table_1.default.Language.create({
                id,
                lang
            });
            return SUCCESS;
        });
    }
    static update(lang, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield table_1.default.Language.update({
                lang
            }, {
                where: {
                    id
                }
            });
            return SUCCESS;
        });
    }
}
exports.default = Language;

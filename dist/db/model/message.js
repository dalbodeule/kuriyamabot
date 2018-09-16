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
class Message {
    static findLeave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield table_1.default.Message.findOne({
                where: {
                    id
                },
                attributes: ['id', 'leaveMessage'],
                raw: true
            });
            return result;
        });
    }
    static createLeave(id, leaveMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield table_1.default.Message.create({
                id,
                leaveMessage
            });
            return SUCCESS;
        });
    }
    static updateLeave(id, leaveMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield table_1.default.Message.update({
                leaveMessage
            }, {
                where: {
                    id
                }
            });
        });
    }
    static findWelcome(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield table_1.default.Message.findOne({
                where: {
                    id
                },
                attributes: ['id', 'welcomeMessage'],
                raw: true
            });
            return result;
        });
    }
    static createWelcome(id, welcomeMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield table_1.default.Message.create({
                id,
                welcomeMessage
            });
            return SUCCESS;
        });
    }
    static updateWelcome(id, welcomeMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield table_1.default.Message.update({
                welcomeMessage
            }, {
                where: {
                    id
                }
            });
        });
    }
}
exports.default = Message;

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
class MessageLogger extends moduleBase_1.message {
    constructor(bot, logger, config) {
        super(bot, logger, config);
        this.bot = bot;
        this.logger = logger;
        this.config = config;
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof msg.text !== 'undefined') {
                this.logger.debug('chatid: ' + msg.chat.id +
                    ', text: ' + msg.text.replace(/\n/g, '\\n') +
                    ', username: ' + this.helper.getuser(msg.from));
            }
        });
    }
}
exports.default = MessageLogger;

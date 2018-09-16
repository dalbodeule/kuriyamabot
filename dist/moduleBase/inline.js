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
class Inline {
    constructor(bot, logger, config) {
        this.config = config;
        this.bot = bot;
        this.logger = logger;
        this.helper = helper_1.default;
    }
    run() {
        this.bot.on('inline_query', (msg) => this.module(msg));
    }
    module(msg) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = Inline;

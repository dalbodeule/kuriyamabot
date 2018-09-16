"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _db_1 = require("../_db");
const language = require("./language");
const message = require("./message");
const defineTable = (tableConfig) => {
    const { name, table, config } = tableConfig;
    return _db_1.default.define(name, table, config);
};
const tables = {
    Language: defineTable(language),
    Message: defineTable(message)
};
_db_1.default.sync();
exports.default = tables;

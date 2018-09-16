"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    dev: process.env.dev || true,
    db: {
        database: process.env.database,
        username: process.env.dbuser,
        password: process.env.dbpw,
        host: process.env.dbhost,
        type: process.env.dbtype
    },
    apiKey: {
        telegram: process.env.telegram,
        whatanime: process.env.whatanime
    },
    bot: null
};

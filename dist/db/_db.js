"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const config_1 = require("../config");
const db = new Sequelize(config_1.config.db.database, config_1.config.db.username, config_1.config.db.password, {
    host: config_1.config.db.host,
    dialect: config_1.config.db.type,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    logging: false
});
exports.default = db;

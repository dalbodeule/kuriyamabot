"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
exports.name = 'language';
exports.config = {
    timestamps: false
};
exports.table = {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    lang: {
        type: Sequelize.STRING, allowNull: false
    }
};

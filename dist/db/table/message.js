"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
exports.name = 'message';
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
    welcomeMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    },
    leaveMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    }
};

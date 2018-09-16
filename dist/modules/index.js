"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callback_changeLang_1 = require("./callback_changeLang");
const callback_help_help_1 = require("./callback_help_help");
const callback_help_image_1 = require("./callback_help_image");
const callback_help_lang_1 = require("./callback_help_lang");
const callback_help_leave_1 = require("./callback_help_leave");
const callback_help_me_1 = require("./callback_help_me");
const callback_help_search_1 = require("./callback_help_search");
const callback_help_start_1 = require("./callback_help_start");
const callback_help_uptime_1 = require("./callback_help_uptime");
const callback_help_welcome_1 = require("./callback_help_welcome");
const callback_help_whatanime_1 = require("./callback_help_whatanime");
const chat_image_1 = require("./chat_image");
const chat_search_1 = require("./chat_search");
const command_help_1 = require("./command_help");
const command_image_success_1 = require("./command_image_success");
const command_image_error_1 = require("./command_image_error");
const command_lang_1 = require("./command_lang");
const command_leave_success_1 = require("./command_leave_success");
const command_leave_error_1 = require("./command_leave_error");
const command_me_1 = require("./command_me");
const command_msginfo_1 = require("./command_msginfo");
const command_search_success_1 = require("./command_search_success");
const command_search_error_1 = require("./command_search_error");
const command_start_1 = require("./command_start");
const command_uptime_1 = require("./command_uptime");
const command_welcome_success_1 = require("./command_welcome_success");
const command_welcome_error_1 = require("./command_welcome_error");
const inline_help_1 = require("./inline_help");
const inline_image_1 = require("./inline_image");
const inline_search_1 = require("./inline_search");
const inline_youtube_1 = require("./inline_youtube");
const message_join_1 = require("./message_join");
const message_left_1 = require("./message_left");
const message_logger_1 = require("./message_logger");
const message_search_1 = require("./message_search");
const message_whatanime_1 = require("./message_whatanime");
const messgae_image_1 = require("./messgae_image");
const modules = {
    callbackChangeLang: callback_changeLang_1.default,
    callbackHelpHelp: callback_help_help_1.default,
    callbackHelpImage: callback_help_image_1.default,
    callbackHelpLang: callback_help_lang_1.default,
    callbackHelpLeave: callback_help_leave_1.default,
    callbackHelpMe: callback_help_me_1.default,
    callbcakHelpSearch: callback_help_search_1.default,
    callbackHelpStart: callback_help_start_1.default,
    callbackHelpUptime: callback_help_uptime_1.default,
    callbackHelpWelcome: callback_help_welcome_1.default,
    callbackHelpWhatanime: callback_help_whatanime_1.default,
    chatImage: chat_image_1.default,
    chatSearch: chat_search_1.default,
    commandHelp: command_help_1.default,
    commandImageSuccess: command_image_success_1.default,
    commandImageError: command_image_error_1.default,
    commandLang: command_lang_1.default,
    commandLeaveSuccess: command_leave_success_1.default,
    commandLeaveError: command_leave_error_1.default,
    commandMe: command_me_1.default,
    commandMsginfo: command_msginfo_1.default,
    commandSearchSuccess: command_search_success_1.default,
    commandSearchError: command_search_error_1.default,
    commandStart: command_start_1.default,
    commandUptime: command_uptime_1.default,
    commandWelcomeSuccess: command_welcome_success_1.default,
    commandWelcomeError: command_welcome_error_1.default,
    inlineHelp: inline_help_1.default,
    inlineImage: inline_image_1.default,
    inlineSearch: inline_search_1.default,
    inlineYoutube: inline_youtube_1.default,
    messageJoin: message_join_1.default,
    messageLeft: message_left_1.default,
    messageLogger: message_logger_1.default,
    messageSearch: message_search_1.default,
    messageWhatanime: message_whatanime_1.default,
    messageImage: messgae_image_1.default
};
exports.default = modules;

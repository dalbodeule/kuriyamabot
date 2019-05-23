import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import { command as Command } from "../operactorBase";

import translate = require("google-translate-api");

export default class CommandTranslateError extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
    this.regexp = new RegExp("^/(?:tr|번역|translate)+(?:@" +
      this.config.bot.username + ")? ?$");
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id;
      try {
        this.logger.info("command: translate, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending");

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ]);

        if (msg.reply_to_message &&
          (msg.reply_to_message.text ||
            msg.reply_to_message.caption)) {

          let translateText: string;

          translateText = msg.reply_to_message.text! ||
            msg.reply_to_message.caption!;

          try {
            let result;
            if (translateText.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
              result = await translate(translateText, {to: "en"});
            } else {
              result = await translate(translateText, {to: "ko"});
            }

            await this.bot.sendMessage(chatid, result.text, {
                reply_to_message_id: msg.message_id,
                parse_mode: "HTML",
              });
            this.logger.info("command: translate, chatid: " + chatid +
              ", username: " + this.helper.getUser(msg.from!) +
              ", command: " + msg.text + ", type: success");
          } catch (e) {
            if (e.message.match(/The language .* is not supported/) != null) {
              await this.bot.sendMessage(chatid, temp.text("command.google.language"), {
                reply_to_message_id: msg.message_id,
                parse_mode: "HTML",
              });
              this.logger.info("command: translate, chatid: " + chatid +
                ", username: " + this.helper.getUser(msg.from!) +
                ", command: " + msg.text + ", type: language error");
              this.logger.debug(e.message);
            } else {
              this.logger.info("command: translate, chatid: " + chatid +
              ", username: " + this.helper.getUser(msg.from!) +
              ", command: " + msg.text + ", type: error");
              this.logger.debug(e);
            }
          }
        } else {
          await this.bot.sendMessage(chatid, "🌎❗️ " +
            temp.text("command.google.info"), {
              reply_to_message_id: msg.message_id,
              parse_mode: "HTML",
              reply_markup: {
                force_reply: true, selective: true,
              },
            });
        }
        this.logger.info("command: help, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success");
      } catch (e) {
        this.logger.error("command: translate, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error");
        this.logger.debug(e.stack);
      }
    }
  }
}

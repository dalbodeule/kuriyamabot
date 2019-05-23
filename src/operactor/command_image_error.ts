import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import { command as Command } from "../operactorBase";

export default class CommandImageError extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
    this.regexp = new RegExp("^/(?:짤|이미지|사진|img|image|pic)+(?:@" +
      this.config.bot.username + ")? ?$");
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id;
      try {
        this.logger.info("command: img, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: command received");
        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ]);
        try {
          await this.bot.sendMessage(chatid, "🖼❗️ " +
            temp.text("command.img.blank"), {
              reply_to_message_id: msg.message_id,
              reply_markup: {
                force_reply: true, selective: true,
              },
            });
          this.logger.info("commahd: img, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: success");
        } catch (e) {
          this.logger.error("commahd: img, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: error");
          this.logger.debug(e.stack);
        }
      } catch (e) {
        this.logger.error("command: img, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error");
        this.logger.debug(e.stack);
      }
    }
  }
}

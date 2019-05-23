import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandWhatanime extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("/(?:무슨애니|whatanime)+(?:@" +
      this.config.bot.username + ")? ?$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        if (msg.document || msg.photo || msg.video) { return }
        if (msg.reply_to_message) {
          if (msg.reply_to_message.photo || msg.reply_to_message.document ||
            msg.reply_to_message.video) { return }
        }
        this.logger.info("message: whatanime, chatid: " + msg.chat.id +
        ", username: " + this.helper.getUser(msg.from!) +
        ", command: whatanime, type: failure")

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])
        await this.bot.sendMessage(chatid, "📺❗️ " + temp.text("command.whatanime.info"), {
          reply_to_message_id: msg.message_id,
          parse_mode: "HTML",
          reply_markup: {
            force_reply: true, selective: true,
          },
        })
        this.logger.info("message: whatanime, chatid: " + chatid +
          ", username: " + this.helper.getUser((msg.from as Telegram.User)) +
          ", command: whatanime, type: failure send success")
      } catch (e) {
        this.logger.error("message: whatanime, chatid: " + chatid +
          ", username: " + this.helper.getUser((msg.from as Telegram.User)) +
          ", command: whatanime, type: failure send error")
        this.logger.debug(e.stack)
      }
    }
  }
}

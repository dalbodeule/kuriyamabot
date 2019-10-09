import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandWeatherArgsNull extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/(?:weather|날씨)+(?:@" +
      this.config.bot.username + ")? ?$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info("command: weather, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending")

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])

        await this.bot.sendMessage(chatid, "☀️ " +
          temp.text("command.weather.command"), {
            reply_to_message_id: msg.message_id,
          })
        this.logger.info("command: weather, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success")
      } catch (e) {
        this.logger.error("command: weather, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

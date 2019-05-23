import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import Lang from "../lang"
import { callback as Callback } from "../operactorBase"

export default class CallbackHelpWeather extends Callback {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module(msg: Telegram.CallbackQuery) {
    const answer = (msg: Telegram.CallbackQuery, temp: Lang) => {
      this.bot.answerCallbackQuery(msg.id, {
        text: temp.text("command.help.twice"),
      })
    }
    const callid = msg.id
    try {
      const temp = await this.helper.getLang(msg, this.logger)
      if (msg.data === "help_weather") {
        if (msg.message!.text !== "🌨 " + temp.help("command.help.weather")) {
          this.logger.info("ecallback: help_weather, callback id: " + callid +
            ", username: " + this.helper.getUser(msg.from) +
            ", command: " + msg.data + ", type: pending")
          try {
            await this.bot.editMessageText("🌨 " + temp.help("command.help.weather"), {
              chat_id: msg.message!.chat.id,
              message_id: msg.message!.message_id,
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: this.helper.commandList(temp),
              },
            })
            this.logger.info("ecallback: help_weather, callback id: " + callid +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.data + ", type: success")
          } catch (e) {
            this.logger.error("ecallback: help_weather, callback id: " + callid +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.data + ", type: error")
            this.logger.debug(e)
          }
        } else {
          answer(msg, temp)
        }
      }
    } catch (e) {
      this.logger.error("ecallback: help_weather, callback id: " + callid +
        ", username: " + this.helper.getUser(msg.from) +
        ", command: " + msg.data + ", type: error")
      this.logger.debug(e)
    }
  }
}

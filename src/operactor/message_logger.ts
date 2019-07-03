import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { message as Message } from "../operactorBase"

export default class MessageLogger extends Message {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.bot = bot
    this.logger = logger
    this.config = config
  }

  public async module(msg: Telegram.Message) {
    if (typeof msg.text !== "undefined") {
      this.logger.debug("chatid: " + msg.chat.id +
      ", text: " + msg.text.replace(/\n/g, "\\n") +
      ", username: " + this.helper.getUser((msg.from as Telegram.User)))
    }
  }
}

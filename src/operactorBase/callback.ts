import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import * as model from "../db"
import * as helper from "../modules"

import { Config } from "../config"

export default class Callback {
  protected config: Config
  protected bot: Telegram
  protected logger: Logger
  protected helper: typeof helper
  protected model: typeof model

  constructor(bot: Telegram, logger: Logger, config: Config) {
    this.config = config
    this.bot = bot
    this.logger = logger
    this.helper = helper
    this.model = model
  }

  public run(): void {
    this.bot.on("callback_query", (msg) => this.module(msg))
  }

  protected async module(msg: Telegram.CallbackQuery): Promise<void> {
    return
  }
}

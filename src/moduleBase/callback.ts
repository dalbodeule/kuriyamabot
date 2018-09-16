import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

import { Config } from '../config'

export default class Callback {
  protected config: Config;
  protected bot: Telegram;
  protected logger: Logger;
  protected helper: any;
  protected model: any;

  constructor (bot: Telegram, logger: Logger, config: Config) {
    this.config = config
    this.bot = bot
    this.logger = logger
    this.helper = helper
  }

  public run (): void {
    this.bot.on('callback_query', this.module)
  }

  protected async module (msg: Telegram.CallbackQuery): Promise<void> {
  }
}
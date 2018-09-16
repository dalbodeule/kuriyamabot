import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

import { config, Config } from '../config'

export default class Inline {
  protected config: Config;
  protected bot: Telegram;
  protected logger: Logger;
  protected helper: any;
  protected model: any;

  constructor (bot: Telegram, logger: Logger) {
    this.config = config
    this.bot = bot
    this.logger = logger
    this.helper = helper
  }

  public run (): void {
    this.bot.on('inline_query', this.module)
  }

  protected async module (msg: Telegram.InlineQuery): Promise<void> {
  }
}
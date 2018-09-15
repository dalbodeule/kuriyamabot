import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

import { config, Config } from '../config'

export default class Command {
  protected config: Config;
  protected bot: Telegram;
  protected logger: Logger;
  protected helper: any;
  protected model: any;
  protected regexp: RegExp

  constructor (bot: Telegram, logger: Logger) {
    this.config = config
    this.bot = bot
    this.logger = logger
    this.helper = helper
    this.regexp = new RegExp('')
  }

  public run (): void {
    this.bot.onText(this.regexp, this.module)
  }

  protected async module (msg: Telegram.Message, match: RegExpExecArray | null): Promise<void> {
  }
}
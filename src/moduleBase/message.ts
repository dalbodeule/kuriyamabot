import * as model from '../db'
import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

import { config, Config } from '../config'

export default class Message {
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
    this.model = model
  }

  public run (): void {
    this.bot.on('message', this.module)
  }

  protected async module (msg: Telegram.Message): Promise<void> {
  }
}
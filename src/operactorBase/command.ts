import * as model from '../db'
import * as helper from '../modules'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

import { Config } from '../config'

export default class Command {
  protected config: Config
  protected bot: Telegram
  protected logger: Logger
  protected helper: typeof helper
  protected model: typeof model
  protected regexp: RegExp

  constructor (bot: Telegram, logger: Logger, config: Config) {
    this.config = config
    this.bot = bot
    this.logger = logger
    this.helper = helper
    this.regexp = new RegExp('')
    this.model = model
  }

  public run (): void {
    this.bot.onText(this.regexp, (msg, match) => this.module(msg, match))
  }

  protected async module (msg: Telegram.Message, match: RegExpExecArray | null): Promise<void> {
  }
}
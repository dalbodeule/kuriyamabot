import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import * as types from '../types'
import config from '../config'

export default class {
  config: types.globalType;
  logger: Logger
  constructor (bot: Telegram, logger: Logger) {
    this.config = config
    this.logger = logger
  }

  async run (): Promise<void> {

  }
}
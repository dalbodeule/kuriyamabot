import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import * as types from '../types'
import config from '../config'

export default class {
  config: types.globalType;
  constructor (bot: Telegram) {
    this.config = config
  }

  private async run (): Promise<void> {

  }
}
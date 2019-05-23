import { message as Message } from '../operactorBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class MessageLogger extends Message {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.bot = bot
    this.logger = logger
    this.config = config
  }

  public async module (msg: Telegram.Message) {
    if (typeof msg.text !== 'undefined') {
      this.logger.debug('chatid: ' + msg.chat.id +
      ', text: ' + msg.text.replace(/\n/g, '\\n') +
      ', username: ' + this.helper.getUser((<Telegram.User>msg.from)))
    }
  }
}

import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

export default (bot: Telegram, logger: Logger) => {
  bot.on('message', (msg) => {
    if (typeof msg.text !== 'undefined') {
      logger.debug('chatid: ' + msg.chat.id + ', text: ' + msg.text.replace(/\n/g, '\\n') + ', username: ' + helper.getuser(msg.from))
    }
  })
}

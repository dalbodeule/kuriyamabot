import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class CommandSearchError extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:검색|google|search|gg)+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])

        try {
          await this.bot.sendMessage(chatid, '🔍❗️ ' +
            temp.text('command.search.blank'), {
              reply_to_message_id: msg.message_id,
              reply_markup: {
                force_reply: true, selective: true
              }
            })
          this.logger.info('command: search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: success')
        } catch (e) {
          this.logger.error('command: search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: error')
          this.logger.debug(e.stack)
        }
      } catch (e) {
        this.logger.error('command: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

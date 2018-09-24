import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class CommandWhatanime extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('/(?:무슨애니|whatanime)+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('message: whatanime, chatid: ' + msg.chat.id +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: whatanime, type: failure')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])
        await this.bot.sendMessage(chatid, '📺❗️ ' + temp.text('command.whatanime.info'), {
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            force_reply: true, selective: true
          }
        })
        this.logger.info('message: whatanime, chatid: ' + chatid +
          ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
          ', command: whatanime, type: failure send success')
      } catch (e) {
        this.logger.error('message: whatanime, chatid: ' + chatid +
          ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
          ', command: whatanime, type: failure send error')
        this.logger.debug(e.stack)
      }
    }
  }
}

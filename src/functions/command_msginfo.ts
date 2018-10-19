import { command as Command } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class CommandMesinfo extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/msginfo+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: msginfo, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')
        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getLang(msg, this.logger)
        ])
        if (msg.reply_to_message) {
          await this.bot.sendMessage(chatid, 
              temp.text('command.msginfo.success') +
              '\n\n`' + JSON.stringify(msg.reply_to_message, null, '  ')
              + '`', {
                reply_to_message_id: msg.message_id,
                parse_mode: 'Markdown'
              })
        } else {
          await this.bot.sendMessage(chatid, temp.text('command.msginfo.alert'), {
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML'
          })
        }
        this.logger.info('command: msginfo, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('command: msginfo, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

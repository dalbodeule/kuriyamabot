import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';

export default class CommandMsginfo extends Command {
  constructor (bot: Telegram, logger: Logger) {
    super (bot, logger)
    this.regexp = new RegExp('^/msginfo+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: msginfo, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: pending')
        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])
        if (msg.reply_to_message) {
          await this.bot.sendMessage(chatid, 
              temp.text('command.msginfo.success') +
              '\n\n`' + msg.reply_to_message + '`', {
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
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: valid')
      } catch (e) {
        this.logger.error('command: msginfo, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

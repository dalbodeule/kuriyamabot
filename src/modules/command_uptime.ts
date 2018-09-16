import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import Format from '../helper/timeFormat'
import { Config } from '../config'

export default class ChatImage extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:작동시간|uptime)+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: uptime, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])

        let uptime = new Format(process.uptime())

        await this.bot.sendMessage(chatid, '✅ ' +
          temp.text('command.uptime.message')
            .replace(/{hour}/g, uptime.hour)
            .replace(/{min}/g, uptime.min)
            .replace(/{sec}/g, uptime.sec), {
              reply_to_message_id: msg.message_id
            })
        this.logger.info('command: uptime, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('command: uptime, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

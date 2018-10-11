import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class EasterGang extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^강공지주$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('easter: gang, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        await this.bot.sendChatAction(chatid, 'typing')

        await this.bot.sendMessage(chatid,
          '다들 <b>힘차게</b> 외쳐봅시다. <b>강.지.공.주.</b>' +
          '\n\n' + 'https://www.youtube.com/watch?v=Mp9MR_JaZMM', {
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML'
          })
        this.logger.info('easter: gang, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('easter: gang, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

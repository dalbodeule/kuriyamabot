import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as path from 'path'
import * as fs from 'fs'

export default class CommandCherry extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^꽃돼핀지$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: cherry, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        await this.bot.sendChatAction(chatid, 'typing')

        await this.bot.sendMessage(chatid,
          '**꽃돼핀지**를 외치면 꽃핀은 **날씬해진다**' +
          '\n\n' + 'https://www.youtube.com/watch?v=uZ1iNekkLr0', {
            reply_to_message_id: msg.message_id,
            parse_mode: 'Markdown'
          })
        this.logger.info('command: cherry, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('command: cherry, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

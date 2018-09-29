import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as path from 'path'
import * as fs from 'fs'

export default class CommandNigai extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('!(?:苦い|にがい|nigai|니가이)')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: nigai, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        await this.bot.sendChatAction(chatid, 'upload_photo')

        const nigai = fs.createReadStream(path.join(__dirname,
            '..', '..', '苦い!!.png'));
        const higai = fs.createReadStream(path.join(__dirname,
          '..', '..', '苦い!!hos.png'));
        
        if ( Math.floor(Math.random() * 3 ) < 2 ) {
          await this.bot.sendPhoto(chatid, nigai, {
              reply_to_message_id: msg.message_id,
              caption: '苦い。。苦い。。苦い！！！！'
            })
          this.logger.debug('nigai')
        } else {
          await this.bot.sendPhoto(chatid, higai, {
              reply_to_message_id: msg.message_id,
              caption: 'ヒガイ。。ヒガイ。。ヒガイ！！！！'
            })
            this.logger.debug('higai')
        }
        
        this.logger.info('command: nigai, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('command: nigai, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

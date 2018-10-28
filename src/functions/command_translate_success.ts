import { command as Command } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

import translate = require('google-translate-api')

export default class CommandTranslateSuccess extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:tr|번역/translate)+(?:@' +
      this.config.bot.username + ')? (.+)$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: translate, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getLang(msg, this.logger)
        ])

        try {
          let string = match[1].split('|')

          let result
          if (string[1]) {
            let lang

            if (string[1] == 'cn' || string[1] == 'Chinese') {
              lang = 'zh-cn'
            } else if (string[1] == 'tw' || string[1].toLocaleLowerCase() == 'kanji') {
              lang = 'zh-tw'
            } else if (string[1] == 'kr') {
              lang = 'ko'
            } else if (string[1] == 'jp') {
              lang = 'ja'
            } else {
              lang = string[1]
            }
            result = await translate(string[0], {to: lang })
          } else {
            if(match[1].match(/[ㄱ-ㅎ가-힣]+/) !== null) {
              result = await translate(match[1], {to: 'en'})
            } else {
              result = await translate(match[1], {to: 'ko'})
            }
          }

          await this.bot.sendMessage(chatid, result.text, {
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
          this.logger.info('command: translate, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: success')
        } catch (e) {
          if (e.message.match(/The language .* is not supported/) != null) {
            await this.bot.sendMessage(chatid, temp.text('command.google.language'), {
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
            this.logger.info('command: translate, chatid: ' + chatid +
              ', username: ' + this.helper.getUser(msg.from!) +
              ', command: ' + msg.text + ', type: language error')
            this.logger.debug(e.message)
          } else {
            this.logger.info('command: translate, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: error')
            this.logger.debug(e)
          }
        }
      } catch (e) {
        this.logger.error('command: translate, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}
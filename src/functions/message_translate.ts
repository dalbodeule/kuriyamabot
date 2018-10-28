import { message as Message } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

import translate = require('google-translate-api')

export default class messageTranslate extends Message {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module (msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.reply_to_message) return
    if ((<Telegram.User>msg.reply_to_message.from).username !==
      this.config.bot.username) return
    if (Math.round((new Date()).getTime() / 1000) -
      msg.reply_to_message.date >= 60) return
    if (!msg.reply_to_message) return
    if (!msg.reply_to_message.text) return
    if (!msg.reply_to_message.text.match(/🌎❗️/)) return

    const chatid = msg.chat.id
    try {
      this.logger.info('message: search, chatid: ' + chatid +
        ', username: ' + this.helper.getUser(msg.from!) +
        ', command: ' + msg.text + ', type: pending')
  
      let [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, 'typing'),
        this.helper.getLang(msg, this.logger)
      ])

      try {
        let string = msg.text!.split('|')

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
          if(msg.text!.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
            result = await translate(msg.text!, {to: 'en'})
          } else {
            result = await translate(msg.text!, {to: 'ko'})
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
      this.logger.error('message: search chatid: ' + chatid +
        ', username: ' + this.helper.getUser(msg.from!) +
        ', command: ' + msg.text + ', type: error')
      this.logger.debug(e.stack)
    }
  }
}

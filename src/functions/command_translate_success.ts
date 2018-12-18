import { command as Command } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

import translate = require('google-translate-api')

export default class CommandTranslateSuccess extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:tr|번역|translate)+(?:@' +
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

        let translateText:string
        let translateTo:string

        if (msg.reply_to_message &&
          (msg.reply_to_message.text ||
            msg.reply_to_message.caption)) {
          
          translateText = msg.reply_to_message.text! ||
            msg.reply_to_message.caption!
          translateTo = match[1]
        } else {
          [ translateText, translateTo ] = match[1].split('|')
        }

        try {

          let result
          if (translateTo) {
            let lang = translateTo.toLocaleLowerCase()
            
            if (lang == 'cn' || lang == 'Chinese' || lang == 'zh') {
              lang = 'zh-cn'
            } else if (lang == 'tw' || lang == 'kanji') {
              lang = 'zh-tw'
            } else if (lang == 'kr') {
              lang = 'ko'
            } else if (lang == 'jp') {
              lang = 'ja'
            }

            result = await translate(translateText, {to: lang })
          } else {
            if(translateText.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
              result = await translate(translateText, {to: 'en'})
            } else {
              result = await translate(translateText, {to: 'ko'})
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

  private getCodeFromFlag(flag: string): string {
    flag = flag.replace(/\uD83C/gm, '')
    //this.logger.debug(`flag: ${flag}, length: ${flag.length}`)
    
    let result = ''

    for(let i=0; i < flag.length; i++) {
      //this.logger.debug(`no: ${i}, code: ${(flag.charAt(i).codePointAt(0)!- '\uDDE6'.codePointAt(0)!) + 97}`)
      result += String.fromCharCode((flag.charAt(i).codePointAt(0)!- '\uDDE6'.codePointAt(0)!) + 97)
    }

    //this.logger.debug(`result: ${result}, length: ${result.length}`)
    return result
  }
}
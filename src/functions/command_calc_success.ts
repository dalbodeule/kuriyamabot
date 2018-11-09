import { command as Command } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

import * as math from 'mathjs'

export default class CommandCalcSuccess extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:calc|계산)+(?:@' +
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
            let scope: {
              [index: string]: string|number
            } = {}

            string[1].split(',').forEach((value, index, array) => {
              value = value.replace(/\ /g, '')
              let variable = value.split('=')
              if (typeof variable[0] != 'number') {
                scope[variable[0]] = variable[1]
              }
            })

            result = math.eval(string[0], scope)
          } else {
            result = math.eval(match[1])
          }

          await this.bot.sendMessage(chatid, result, {
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
          this.logger.info('command: translate, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: success')
        } catch (e) {
          await this.bot.sendMessage(chatid, temp.text('command.calc.error'), {
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML'
          })
          this.logger.info('command: translate, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: language error')
          this.logger.debug(e.message)
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
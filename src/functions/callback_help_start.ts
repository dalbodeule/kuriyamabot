import { callback as Callback } from '../functionBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import Lang from '../lang'

export default class CallbackHelpHelp extends Callback {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module (msg: Telegram.CallbackQuery) {
    const answer = (msg: Telegram.CallbackQuery, temp: Lang) => {
      this.bot.answerCallbackQuery(msg.id, {
        text: temp.text('command.help.twice')
      })
    }
    const callid = msg.id
    try {
      let temp = await this.helper.getLang(msg, this.logger)
      if (msg.data === 'help_start') {
        if (msg.message!.text !== '👋 ' + temp.help('command.help.start')) {
          this.logger.info('callback: help_start, callback id: ' + callid +
            ', username: ' + this.helper.getUser(msg.from) +
            ', command: ' + msg.data + ', type: pending')
          try {
            temp = await this.helper.getLang(msg, this.logger)
            await this.bot.editMessageText('👋 ' + temp.help('command.help.start'), {
              chat_id: msg.message!.chat.id,
              message_id: msg.message!.message_id,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: this.helper.commandList(temp)
              }})
            this.logger.info('callback: help_start, callback id: ' + callid +
              ', username: ' + this.helper.getUser(msg.from) +
              ', command: ' + msg.data + ', type: success')
          } catch (e) {
            this.logger.error('callback: help_start, callback id: ' + callid +
              ', username: ' + this.helper.getUser(msg.from) +
              ', command: ' + msg.data + ', type: error')
            this.logger.debug(e)
          }
        } else {
          answer(msg, temp)
        }
      }
    } catch (e) {
      this.logger.error('callback id: ' + callid +
        ', username: ' + this.helper.getUser(msg.from) +
        ', command: ' + msg.data + ', type: error')
      this.logger.debug(e)
    }
  }
}

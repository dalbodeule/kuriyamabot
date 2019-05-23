import { command as Command } from '../operactorBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

const version: string = require('../../package.json').version

export default class CommandHelp extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:help|도움말)+(?:@' +
      this.config.bot.username + ')? ?$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: help, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getLang(msg, this.logger)
        ])

        await this.bot.sendMessage(chatid, '📒 ' +
          temp.help('command.help.help')
            .replace(/{version}/, version), {
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: this.helper.commandList(temp)
              }
            })
        this.logger.info('command: help, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: success')
      } catch (e) {
        this.logger.error('command: help, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

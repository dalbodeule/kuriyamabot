import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as google from 'google-parser'

export default class CommandSearchSuccess extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:검색|google|search|gg)+(?:@' +
      this.config.bot.username + ')? (.+)$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      let temp
      try {
        this.logger.info('command: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])

        let response = await this.helper.search(match[1])

        if (!response) {
          await this.bot.sendMessage(chatid, '🔍 ' +
            temp.text('command.search.not_found'), {
              reply_to_message_id: msg.message_id
            })
          this.logger.info('command: search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: success, response: not found')
        } else if ((<google.error>response).error) {
          await this.bot.sendMessage(chatid, '🔍 ' +
            temp.text('command.search.bot_block'), {
              reply_to_message_id: msg.message_id
            })
          this.logger.info('command: search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: success, response: google bot block')
        } else {
          try {
            await this.bot.sendMessage(chatid, '🔍 ' +
              temp.text('command.search.result') + '\n' + response, {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_to_message_id: msg.message_id,
                reply_markup: {
                  inline_keyboard: [[{
                    text: temp.text('command.search.visit_google'),
                    url: 'https://www.google.com/search?q=' + encodeURIComponent(match[1]) + '&ie=UTF-8'
                  }, {
                    text: temp.text('command.search.another'),
                    switch_inline_query_current_chat: 'search ' + match[1]
                  }]]
                }
              })
            this.logger.info('command: search, chatid: ' + chatid +
              ', username: ' + this.helper.getuser(msg.from!) +
              ', command: ' + msg.text + ', type: success, response: search success')
          } catch (e) {
            await this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.search.error')
              .replace(/{botid}/g, '@' + this.config.bot.username)
              .replace(/{keyword}/g, match[1]), {
              reply_markup: {
                inline_keyboard: [[{
                  text: '@' + this.config.bot.username + ' search ' + match[1],
                  switch_inline_query_current_chat: 'search ' + match[1]
                }]]
              },
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
            this.logger.error('command: search, chatid: ' + chatid +
              ', username: ' + this.helper.getuser(msg.from!) +
              ', command: ' + msg.text + ', type: error')
            this.logger.debug(e.stack)
          }
        }
      } catch (e) {
        this.logger.error('command: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

import { message as Message } from '../operactorBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as google from 'google-parser'

export default class messageSearch extends Message {
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
    if (!msg.reply_to_message.text.match(/🔍❗️/)) return

    const chatid = msg.chat.id
    try {
      this.logger.info('message: search, chatid: ' + chatid +
        ', username: ' + this.helper.getUser(msg.from!) +
        ', command: ' + msg.text + ', type: pending')
  
      let [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, 'typing'),
        this.helper.getLang(msg, this.logger)
      ])

      let response = await this.helper.search.search(msg.text!)

      if (!response) {
        await this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.not_found'), {
            reply_to_message_id: msg.message_id
          })
        this.logger.info('message: search, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: success, response: not found')
      } else if ((<google.error>response).error) {
        this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.not_found'), {
            reply_to_message_id: msg.message_id
          })
        this.logger.info('message: search, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          'command: ' + msg.text + ', type: success, response: google bot block')
      } else {
        try {
          await this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.result') + '\n' + response, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.search.another'),
                url: 'https://www.google.com/search?q=' +
                  encodeURIComponent(msg.text!) + '&ie=UTF-8'
              }, {
                text: temp.text('command.search.another'),
                switch_inline_query_current_chat: 'search ' + msg.text
              }]]
            }
          })
          this.logger.info('message: search, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: success, response: search success')
        } catch (e) {
          await this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.search.error')
              .replace(/{botid}/g, '@' + this.config.bot.username)
              .replace(/{keyword}/g, msg.text!), {
              reply_markup: {
                inline_keyboard: [[{
                  text: '@' + this.config.bot.username + ' search ' + msg.text,
                  switch_inline_query_current_chat: 'search ' + msg.text
                }]]
              },
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
          this.logger.error('message: search chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: error')
          this.logger.debug(e.stack)
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

import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as google from 'google-parser'

export default class ChatSearch extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = /\{(?:gg|문서|검색|구글|google) (.*)(?:\{|\})/
  }
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    const type = 'search'
    const chatid = msg.chat.id
    try {
      this.logger.info('command: chat_search chatid: ' + chatid +
        ', username: ' + this.helper.getuser(msg.from!) +
        ', chat command: ' + type + ', type: pending')
      
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
        this.logger.info('command: chat_search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', chat command: ' + type + ', type: valid, response: not found')
      } else if ((<google.error>response).error) {
        await this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.bot_block'), {
            reply_to_message_id: msg.message_id
          })
        this.logger.info('command: chat_search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', chat command: ' + type + ', type: valid, response: google bot block')
      } else {
        try {
          await this.bot.sendMessage(chatid, (<string>response), {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.search.visit_google'),
                url: 'https://www.google.com/search?q=' +
                  encodeURIComponent(match[1]) + '&ie=UTF-8'
              }, {
                text: temp.text('command.img.another'),
                switch_inline_query_current_chat: 'search ' + match[1]
              }]]
            }
          })
          this.logger.info('command: chat_search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + type + ', type: valid, response: search success')
        } catch (e) {
          this.logger.error('command: chat_search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: error')
          this.logger.debug(e.stack)
        }
      }
    } catch (e) {
      this.logger.error('command: chat_search, chatid: ' + chatid +
        ', username: ' + this.helper.getuser(msg.from!) +
        ', command: ' + msg.text + ', type: error')
      this.logger.debug(e.stack)
    }
  }
}

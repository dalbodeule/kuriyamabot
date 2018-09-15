import { message as Message } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'

export default class messageSearch extends Message {
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
        ', username: ' + this.helper.getuser(msg.from) +
        ', command: ' + msg.text + ', type: pending')
  
      let [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, 'typing'),
        this.helper.getlang(msg, this.logger)
      ])

      let response = await this.helper.search(msg.text)

      if (!response) {
        await this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.not_found'), {
            reply_to_message_id: msg.message_id
          })
        this.logger.info('message: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.text + ', type: valid, response: not found')
      } else if (response.error) {
        this.bot.sendMessage(chatid, '🔍 ' +
          temp.text('command.search.not_found'), {
            reply_to_message_id: msg.message_id
          })
        this.logger.info('message: search, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          'command: ' + msg.text + ', type: valid, response: google bot block')
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
                  encodeURIComponent((<string>msg.text)) + '&ie=UTF-8'
              }, {
                text: temp.text('command.search.another'),
                switch_inline_query_current_chat: 'search ' + msg.text
              }]]
            }
          })
          this.logger.info('message: search, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from) +
            ', command: ' + msg.text + ', type: valid, response: search success')
        } catch (e) {
          this.logger.error('message: search chatid: ' + chatid +
            ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
            ', command: ' + msg.text + ', type: error, response: message send error')
          this.logger.debug(e.stack)
        }
      }
    } catch (e) {
      this.logger.error('message: search chatid: ' + chatid +
        ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
        ', command: ' + msg.text + ', type: error, response: message send error')
      this.logger.debug(e.stack)
    }
  }
}

import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';

export default class ChatImage extends Command {
  constructor (bot: Telegram, logger: Logger) {
    super (bot, logger)
    this.regexp = /\{(?:img|pic|사진|이미지|짤) (.*)(?:\{|\})/
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    const type = 'image'
    const chatid = msg.chat.id
    try {
      this.logger.info('command: chat_image, chatid: ' + chatid +
        ', username: ' + this.helper.getuser(msg.from) + 
        ', command: ' + type + ', type: pending')

      let [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, 'upload_photo'),
        this.helper.getlang(msg, this.logger)
      ])

      let response = await this.helper.image(match[1])

      if (!response) {
        await this.bot.sendChatAction(chatid, 'typing')
        await this.bot.sendMessage(chatid, '🖼 ' + temp.text('command.img.not_found'), {reply_to_message_id: msg.message_id})
        this.logger.info('command: chat_image, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + type + ', type: valid, response: not found')
      } else {
        try {
          await this.bot.sendChatAction(chatid, 'upload_photo')
          await this.bot.sendPhoto(chatid, response.img, {
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.img.visit_page'),
                url: response.url
              }, {
                text: temp.text('command.img.view_image'),
                url: response.img
              }], [{
                text: temp.text('command.img.another'),
                switch_inline_query_current_chat: 'img ' + match[1]
              }]]
            },
            reply_to_message_id: msg.message_id
          })
          this.logger.info('command: chat_image, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from) +
            ', command: ' + type + ', type: valid, response: search success')
        } catch (e) {
          try {
            await this.bot.sendChatAction(chatid, 'upload_photo')
            response = await this.helper.image((<RegExpExecArray>match)[1])

            await this.bot.sendPhoto(chatid, response.img, {
              reply_markup: {
                inline_keyboard: [[{
                  text: temp.text('command.img.visit_page'),
                  url: response.url
                }, {
                  text: temp.text('command.img.view_image'),
                  url: response.img
                }], [{
                  text: temp.text('command.img.another'),
                  switch_inline_query_current_chat: 'img ' + (<RegExpExecArray>match)[1]
                }]]
              },
              reply_to_message_id: msg.message_id
            })
            this.logger.info('command: chat_image, chatid: ' + chatid +
              ', username: ' + this.helper.getuser(msg.from) +
              ', command: ' + type + ', type: valid, response: search success')
          } catch (e) {
            this.logger.error('command: chat_image chatid: ' + chatid +
              ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
              ', command: ' + type + ', type: error')
            this.logger.debug(e.stack)
          }
        }
      }
    } catch (e) {
      this.logger.error('command: chat_image chatid: ' + chatid +
        ', username: ' + this.helper.getuser((<Telegram.User>msg.from)) +
        ', command: ' + type + ', type: error')
      this.logger.debug(e.stack)
    }
  }
}

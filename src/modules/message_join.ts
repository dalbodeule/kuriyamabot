import { message as Message } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'

export default class MessageJoin extends Message {
  protected async module (msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.new_chat_members) return

    const chatid = msg.chat.id
    
    try {
      this.logger.info('message: chat join, chatid: ' + chatid + 
        ', userid: ' + msg.new_chat_members[0].id + ', status: pending')

      let [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, 'typing'),
        this.helper.getlang(msg, this.logger)
      ])
      
      if (msg.new_chat_members[0].id !== this.config.bot.id) {
        let value = await this.model.message.findWelcome(chatid)
        if (!value) {
          await this.bot.sendMessage(chatid, temp.text('message.join')
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
            reply_to_message_id: msg.message_id
          })
        } else if (value.welcomeMessage === 'off') {

        } else {
          let welcomeMessage = value.welcomeMessage || temp.text('message.join')
          await this.bot.sendMessage(chatid, welcomeMessage
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
            reply_to_message_id: msg.message_id
          })
        }
        this.logger.info('message: chat join, chatid: ' + chatid + 
          ', userid: ' + msg.new_chat_members[0].id + ', status: success')
      } else {
        await this.bot.sendChatAction(chatid, 'typing')
        await this.bot.sendMessage(chatid, '👋 ' + temp.text('message.botjoin'))
        this.logger.info('message: chat join, chatid: ' + chatid +
          ', i\'m join room!, status: success')
      }
    } catch (e) {
      this.logger.error('message: chat join, chatid: ' + chatid +
        ', userid: ' + msg.new_chat_members[0].id + ', status: error')
      this.logger.debug(e.stack)
    }
  }
}

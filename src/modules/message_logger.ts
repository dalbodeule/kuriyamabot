import { message as Message } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'

export default class MessageLogger extends Message {
  protected async module (msg: Telegram.Message) {
    if (typeof msg.text !== 'undefined') {
      this.logger.debug('chatid: ' + msg.chat.id +
      ', text: ' + msg.text.replace(/\n/g, '\\n') +
      ', username: ' + this.helper.getuser((<Telegram.User>msg.from)))
    }
  }
}

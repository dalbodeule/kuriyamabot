import { callback as Callback } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'

export default class CallbackChangeLang extends Callback {
  protected async module (msg: Telegram.CallbackQuery) {
    let test = (<string>msg.data).match(/changelang_([a-zA-Z]{2})/)
    if (test) {
      const callid = msg.id
      try {
        let temp
        this.logger.info('callback: change_lang, callback id: ' + callid +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.data + ', type: pending')

        if ((<Telegram.Message>msg.message).chat.type === 'private') {
          temp = await this.helper.getlang(msg, this.logger)
          await temp.langset(test[1])
          await this.bot.editMessageText(temp.text('command.lang.success'), {chat_id: (<Telegram.Message>msg.message).chat.id,
            message_id: (<Telegram.Message>msg.message).message_id,
            parse_mode: 'HTML'
          })
          this.logger.info('callback: change_lang, callback id: ' + callid +
            ', username: ' + this.helper.getuser(msg.from) +
            ', command: ' + msg.data + ', type: valid')
        } else {
          // eslint-disable-next-line
          let admins, isAdmin = false;
          [temp, admins] = await Promise.all([
            this.helper.getlang(msg, this.logger),
            this.bot.getChatAdministrators((<Telegram.Message>msg.message).chat.id)
          ])
          isAdmin = admins.some((v) => {
            return v.user.id === msg.from.id
          })
          if (isAdmin) {
            temp = await this.helper.getlang(msg, this.logger)
            await temp.langset(test[1])
            await this.bot.editMessageText(temp.text('command.lang.success'), {
              chat_id: (<Telegram.Message>msg.message).chat.id,
              message_id: (<Telegram.Message>msg.message).message_id,
              parse_mode: 'HTML'
            })
            this.logger.info('callback: change_lang callback id: ' + callid +
            ', username: ' + this.helper.getuser(msg.from) +
            ', command: ' + msg.data + ', type: group valid')
          } else {
            await this.bot.editMessageText(temp.text('command.lowPermission'), {
              chat_id: (<Telegram.Message>msg.message).chat.id,
              message_id: (<Telegram.Message>msg.message).message_id,
              parse_mode: 'HTML'
            })
            this.logger.info('callback: change_lang callback id: ' + callid +
            ', username: ' + this.helper.getuser(msg.from) +
            ', command: ' + msg.data + ', type: group lowPermission')
          }
        }
      } catch (e) {
        this.logger.error('callback: change_lang callback id: ' + callid +
          ', username: ' +this.helper.getuser(msg.from) +
          ', command: ' + msg.data + ', type: error')
        this.logger.debug(e)
      }
    }
  }
}

import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'

export default class CommandLeaveSuccess extends Command {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/leave+(?:@' +
      this.config.bot.username + ')? ([^\r]+)$')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: leave, chatid: ' + chatid
          + ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')
        // eslint-disable-next-line
        let isAdmin, send, temp, admins: Array<Telegram.ChatMember>
        [send, temp, admins] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger),
          this.bot.getChatAdministrators(chatid)
        ])
        if (msg.chat.type === 'private') {
          await this.bot.sendMessage(chatid, '❗️ ' +
            temp.text('command.isnotgroup'))
          this.logger.info('command: leave, chatid: ' + chatid +
            ', username: ' + this.helper.getuser(msg.from!) +
            ', command: ' + msg.text + ', type: is not group')
        } else {
          isAdmin = admins.some((v) => {
            return v.user.id === msg.from!.id
          })
          if (!isAdmin) {
            await this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.lowPermission'))
            this.logger.info('command: leave, chatid: ' + chatid +
              ', username: ' + this.helper.getuser(msg.from!) +
              ', command: ' + msg.text + ', type: low Permission')
          } else {
            let value = await this.model.message.findLeave(chatid)

            if (!value) {
              await this.model.message.createLeave(chatid, match[1])
              await this.bot.sendMessage(chatid, ' ' +
                temp.text('command.leave.success'), {
                  reply_to_message_id: msg.message_id
                })
              this.logger.info('command: leave, chatid: ' + chatid +
                ', username: ' + this.helper.getuser(msg.from!) +
                ', command: ' + msg.text + ', type: create success')
            } else {
              if (value && !value.leaveMessage) {
                await this.model.message.updateLeave(chatid, match[1])
                await this.bot.sendMessage(chatid, ' ' +
                  temp.text('command.leave.success'), {
                    reply_to_message_id: msg.message_id
                  })
                this.logger.info('command: leave, chatid: ' + chatid +
                  ', username: ' + this.helper.getuser(msg.from!) +
                  ', command: ' + msg.text + ', type: update success')
              } else {
                await this.model.message.updateLeave(chatid, match[1])
                await this.bot.sendMessage(chatid, ' ' +
                  temp.text('command.leave.success'), {
                    reply_to_message_id: msg.message_id
                  })
                this.logger.info('command: leave, chatid: ' + chatid +
                  ', username: ' + this.helper.getuser(msg.from!) +
                  ', command: ' + msg.text + ', type: update success')
              }
            }
          }
        }
      } catch (e) {
        this.logger.error('command: leave, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

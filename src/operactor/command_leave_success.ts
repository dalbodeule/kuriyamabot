import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandLeaveSuccess extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/leave+(?:@" +
      this.config.bot.username + ")? ([^\r]+)$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info("command: leave, chatid: " + chatid
          + ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending")

        let isAdmin
        let send
        let temp
        let admins: Telegram.ChatMember[]
        [send, temp, admins] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
          this.bot.getChatAdministrators(chatid),
        ])
        if (msg.chat.type === "private") {
          await this.bot.sendMessage(chatid, "❗️ " +
            temp.text("command.isnotgroup"))
          this.logger.info("command: leave, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: is not group")
        } else {
          isAdmin = admins.some((v) => {
            return v.user.id === msg.from!.id
          })
          if (!isAdmin) {
            await this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.lowPermission"))
            this.logger.info("command: leave, chatid: " + chatid +
              ", username: " + this.helper.getUser(msg.from!) +
              ", command: " + msg.text + ", type: low Permission")
          } else {
            const value = await this.model.leaveMessage.find(chatid)

            if (!value) {
              await this.model.leaveMessage.create(chatid, match[1])
              await this.bot.sendMessage(chatid, " " +
                temp.text("command.leave.success"), {
                  reply_to_message_id: msg.message_id,
                })
              this.logger.info("command: leave, chatid: " + chatid +
                ", username: " + this.helper.getUser(msg.from!) +
                ", command: " + msg.text + ", type: create success")
            } else {
              if (value && !value.message) {
                await this.model.leaveMessage.update(chatid, match[1], null)
                await this.bot.sendMessage(chatid, " " +
                  temp.text("command.leave.success"), {
                    reply_to_message_id: msg.message_id,
                  })
                this.logger.info("command: leave, chatid: " + chatid +
                  ", username: " + this.helper.getUser(msg.from!) +
                  ", command: " + msg.text + ", type: update success")
              } else {
                await this.model.leaveMessage.update(chatid, match[1], null)
                await this.bot.sendMessage(chatid, " " +
                  temp.text("command.leave.success"), {
                    reply_to_message_id: msg.message_id,
                  })
                this.logger.info("command: leave, chatid: " + chatid +
                  ", username: " + this.helper.getUser(msg.from!) +
                  ", command: " + msg.text + ", type: update success")
              }
            }
          }
        }
      } catch (e) {
        this.logger.error("command: leave, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { message as Message } from "../operactorBase"

export default class MessageLeft extends Message {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module(msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) { return }
    if (!msg.left_chat_member) { return }

    const chatid = msg.chat.id

    try {
      this.logger.info("message: chat left, chatid: " + chatid +
        ", userid: " + msg.left_chat_member.id + "status: pending")

      this.logger.debug(`msg.left_chat_member: ${msg.left_chat_member.id}`)
      this.logger.debug(`this.config: ${this.config.bot.id}`)
      if (msg.left_chat_member.id == this.config.bot.id) {
        await this.model.user.delete(chatid)

        this.logger.info("message: chat left, chatid: " + chatid +
          ", I'm has left, status: success")
      } else {
        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])

        const value = await this.model.leaveMessage.find(chatid)
        if (!value) {
          await this.bot.sendMessage(chatid, temp.text("message.left")
            .replace(/{roomid}/g, msg.chat.title!)
            .replace(/{userid}/g, msg.left_chat_member.first_name), {
            reply_to_message_id: msg.message_id,
          })
        } else if (value.message === "off") {

        } else {
          const message = value.message || temp.text("message.left")
          await this.bot.sendMessage(chatid, message
            .replace(/{roomid}/g, msg.chat.title!)
            .replace(/{userid}/g, msg.left_chat_member.first_name), {
            reply_to_message_id: msg.message_id,
          })
        }
        this.logger.info("message: chat left, chatid: " + chatid +
          ", userid: " + msg.left_chat_member.id + "status: success")
      }
    } catch (e) {
      this.logger.error("message: chat left, chatid: " + chatid +
        ", userid: " + msg.left_chat_member.id + " status: error")
      this.logger.debug(e.stack)
    }
  }
}

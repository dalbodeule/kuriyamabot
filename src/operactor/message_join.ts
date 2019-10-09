import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { message as Message } from "../operactorBase"

export default class MessageJoin extends Message {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module(msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) { return }
    if (!msg.new_chat_members) { return }

    const chatid = msg.chat.id

    try {
      this.logger.info("message: chat join, chatid: " + chatid +
        ", userid: " + msg.new_chat_members[0].id + ", status: pending")

      const [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, "typing"),
        this.helper.getLang(msg, this.logger),
      ])

      if (msg.new_chat_members[0].id !== this.config.bot.id) {
        const value = await this.model.welcomeMessage.find(chatid)
        if (!value) {
          await this.bot.sendMessage(chatid, temp.text("message.join")
            .replace(/{roomid}/g, msg.chat.title!)
            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
            reply_to_message_id: msg.message_id,
          })
        } else if (value.isEnabled) {
          const message = value.message || temp.text("message.join")
          await this.bot.sendMessage(chatid, message
            .replace(/{roomid}/g, msg.chat.title!)
            .replace(/{userid}/g, msg.new_chat_members[0].first_name), {
            reply_to_message_id: msg.message_id,
          })
        }
        this.logger.info("message: chat join, chatid: " + chatid +
          ", userid: " + msg.new_chat_members[0].id + ", status: success")
      } else {
        await this.bot.sendChatAction(chatid, "typing")
        await this.bot.sendMessage(chatid, "👋 " + temp.text("message.botjoin"))
        this.logger.info("message: chat join, chatid: " + chatid +
          ", i'm join room!, status: success")
        await this.model.user.create(chatid, msg.chat.title || "", msg.chat.type)
      }
    } catch (e) {
      this.logger.error("message: chat join, chatid: " + chatid +
        ", userid: " + msg.new_chat_members[0].id + ", status: error")
      this.logger.debug(e.stack)
    }
  }
}

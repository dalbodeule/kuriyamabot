import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandLang extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/(?:언어변경|언어|lang|langset)+(?:@" +
      this.config.bot.username + ")? ?$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      let temp, send
      try {
        this.logger.info("command: lang, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: command received")
        const ctype = msg.chat.type
        if (ctype === "group" || ctype === "supergroup" || ctype === "channel") {
          let admins, isAdmin = false;
          [send, temp, admins] = await Promise.all([
            this.bot.sendChatAction(chatid, "typing"),
            this.helper.getLang(msg, this.logger),
            this.bot.getChatAdministrators(chatid),
          ])
          isAdmin = isAdmin = admins.some((v) => {
            return v.user.id === msg.from!.id
          })
          if (!isAdmin) {
            await this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.lowPermission"))
            this.logger.info("command: lang, chatid: " + chatid +
              ", username: " + this.helper.getUser(msg.from!) +
              ", command: " + msg.text + ", type: lowPermission")
          } else {
            await this.bot.sendMessage(chatid, "🔤 " +
              temp.text("command.lang.announce"), {
                reply_to_message_id: msg.message_id,
                parse_mode: "HTML",
                reply_markup: {
                  inline_keyboard:
                    this.helper.langList(
                      temp,
                      msg.from!.id
                    ),
                },
              })
          }
        } else {
          [send, temp] = await Promise.all([
            this.bot.sendChatAction(chatid, "typing"),
            this.helper.getLang(msg, this.logger),
          ])
          await this.bot.sendMessage(chatid, "🔤 " +
            temp.text("command.lang.announce"), {
              reply_to_message_id: msg.message_id,
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard:
                  this.helper.langList(
                    temp,
                    msg.from!.id
                  ),
              },
            })
        }
        this.logger.info("command: lang, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success")
      } catch (e) {
        this.logger.error("command: lang, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandMe extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/(?:정보|me)+(?:@"
      + this.config.bot.username + ")? ?$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info("command: me, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending")

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])
        await this.bot.sendMessage(chatid, "📟" + "\n\n" +
          temp.text("command.me")
            .replace(/{userid}/g, "" + msg.from!.id!)
            .replace(/{fname}/g, (!msg.from!.first_name ? "none" : msg.from!.first_name))
            .replace(/{lname}/g, (!msg.from!.last_name ? "none" : msg.from!.last_name!))
            .replace(/{name}/g, (!msg.from!.username ? "none" : "@" + msg.from!.username))
            .replace(/{lang}/g, (!msg.from!.language_code! ? "??" : msg.from!.language_code!)), {
              reply_to_message_id: msg.message_id,
              parse_mode: "Markdown",
            })
        this.logger.info("command: me, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success")
      } catch (e) {
        this.logger.error("command: me, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class CommandHomepage extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/(?:홈페이지|homepage)+(?:@"
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
        await this.bot.sendMessage(chatid, "🌎 " +
          temp.text("command.homepage.message")
          .replace(/{botname}/g, this.config.bot.first_name), {
            reply_to_message_id: msg.message_id,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text("command.homepage.button"),
                url: this.config.homepage,
              }]],
            },
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

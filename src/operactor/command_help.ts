import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

// tslint:disable-next-line: no-var-requires
const version: string = require("../../package.json").version

export default class CommandHelp extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp("^/(?:help|도움말)+(?:@" +
      this.config.bot.username + ")? ?$")
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info("command: help, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending")

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])

        await this.bot.sendMessage(chatid, "📒 " +
          temp.text("command.help.content")
            .replace(/{version}/, version), {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [[{
                  text: "📃 " + temp.inline("command.homepage.button"),
                  url: `${this.config.homepage}functions`,
                }],
                [{
                  text: "😁 " + temp.inline("command.help.contact"),
                  url: "https://t.me/dalbodeule",
                }],
                [{
                  text: "👍 " + temp.inline("command.help.donate"),
                  url: "https://liberapay.com/dalbodeule",
                }]],
              },
              reply_to_message_id: msg.message_id,
            })
        this.logger.info("command: help, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success")
      } catch (e) {
        this.logger.error("command: help, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

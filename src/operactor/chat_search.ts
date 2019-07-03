import { ISearchError } from "google-parser/dist/operactors/search"
import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import { command as Command } from "../operactorBase"

export default class ChatSearch extends Command {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = /\{(?:gg|문서|검색|구글|google) (.*)(?:\{|\})/
  }
  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) { return }
    const type = "search"
    const chatid = msg.chat.id
    try {
      this.logger.info("command: chat_search chatid: " + chatid +
        ", username: " + this.helper.getUser(msg.from!) +
        ", chat command: " + type + ", type: pending")

      const [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, "typing"),
        this.helper.getLang(msg, this.logger),
      ])

      const response = await this.helper.search(match[1])

      if (!response) {
        await this.bot.sendMessage(chatid, "🔍 " +
          temp.text("command.search.not_found"), {
            reply_to_message_id: msg.message_id,
          })
        this.logger.info("command: chat_search, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", chat command: " + type + ", type: success, response: not found")
      } else if ((response as ISearchError).error) {
        await this.bot.sendMessage(chatid, "🔍 " +
          temp.text("command.search.bot_block"), {
            reply_to_message_id: msg.message_id,
          })
        this.logger.info("command: chat_search, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", chat command: " + type + ", type: success, response: google bot block")
      } else {
        try {
          await this.bot.sendMessage(chatid, (response as string), {
            disable_web_page_preview: true,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text("command.search.visit_google"),
                url: "https://www.google.com/search?q=" +
                  encodeURIComponent(match[1]) + "&ie=UTF-8",
              }, {
                switch_inline_query_current_chat: "search " + match[1],
                text: temp.text("command.img.another"),
              }]],
            },
            reply_to_message_id: msg.message_id,
          })
          this.logger.info("command: chat_search, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + type + ", type: success, response: search success")
        } catch (e) {
          this.logger.error("command: chat_search, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: error")
          this.logger.debug(e.stack)
        }
      }
    } catch (e) {
      this.logger.error("command: chat_search, chatid: " + chatid +
        ", username: " + this.helper.getUser(msg.from!) +
        ", command: " + msg.text + ", type: error")
      this.logger.debug(e.stack)
    }
  }
}

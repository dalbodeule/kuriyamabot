import * as google from "google-parser"
import { ISearch, ISearchError } from "google-parser/dist/operactors/search"
import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import Lang from "../lang"
import { inline as Inline } from "../operactorBase"

export default class InlineSearch extends Inline {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module(msg: Telegram.InlineQuery) {
    const q = {
      id: msg.id, query: msg.query,
    }

    function getdesc(description: string, url: string, title: string, temp: Lang) {
      description = description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "")
      const shot = url.toString().match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/watch\?v=+([^&]+)/)
      if (shot !== null) {
        return "https://youtu.be/" + shot[1]
      } else if (description === "") {
        return temp.inline("command.search.desc_null")
      } else {
        if (description.length > 87) {
          description = description.substr(0, 87) + "..."
        }
        return `<a href="${url}">${title}</a>\n\n${description || ""}`
      }
    }

    const match = q.query
      .match(/^(?:([search|google|query|검색|구글]+)(?:| (.*)+))$/)
    if (match) {
      this.logger.info("inline: search, inlineid: " + q.id +
        ", username: " + this.helper.getUser(msg.from) +
        ", command: " + msg.query + ", type: pending")
      try {
        const temp = await this.helper.getLang(msg, this.logger)
        if (typeof match[2] === "undefined" || match[2] === "") {
          try {
            await this.bot.answerInlineQuery(q.id, [{
              type: "article",
              title: "@" + this.config.bot.username +
                " (search|google|query) (keyword)",
              id: "help",
              input_message_content: {
                message_text: "@" + this.config.bot.username +
                  " (search|google|query) (keyword)",
                parse_mode: "HTML",
                disable_web_page_preview: true,
              },
              reply_markup: {
                inline_keyboard: [[{
                  text: "🔍",
                  switch_inline_query_current_chat: "search ",
                }]],
              },
            }], {
              cache_time: 3,
            })
            this.logger.info("inline: search, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: success, response: help")
          } catch (e) {
            this.logger.error("inline: search, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: error")
            this.logger.debug(e)
          }
        } else {
          try {
            const response = await google.search(match[2])
            if ((response as ISearchError).reson === "antibot") {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: "article",
                  title: temp.inline("command.search.bot_blcok"),
                  id: "google bot block",
                  input_message_content: {
                    message_text: temp.inline("command.search.bot_blcok"),
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                  },
                }], {
                  cache_time: 3,
                })
                this.logger.info("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success, response: google bot block")
              } catch (e) {
                this.logger.error("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: error")
                this.logger.debug(e.stack)
              }
            } else if (!(response as ISearch[])[0]) {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: "article",
                  title: temp.inline("command.search.not_found"),
                  id: "not found",
                  input_message_content: {
                    message_text: temp.inline("command.search.not_found"),
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                  },
                }], {
                  cache_time: 3,
                })
                this.logger.info("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success, response: not found")
              } catch (e) {
                this.logger.error("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: error")
                this.logger.debug(e.stack)
              }
            } else {
              (response as ISearch[]).splice(30)
              const results: Telegram.InlineQueryResult[] = []
              let i: any = 0
              for (i in response) {
                if (i) {
                  results.push({
                    type: "article",
                    title: (response as ISearch[])[i].title,
                    id: q.id + "/document/" + i,
                    input_message_content: {
                      message_text: getdesc(
                        (response as ISearch[])[i].description,
                        (response as ISearch[])[i].url,
                        (response as ISearch[])[i].title,
                        temp
                      ),
                      parse_mode: "HTML",
                    },
                    reply_markup: {
                      inline_keyboard: [[{
                        text: temp.inline("command.search.visit_page"),
                        url: (response as ISearch[])[i].url,
                      }, {
                        text: temp.inline("command.search.another"),
                        switch_inline_query_current_chat: "search " + match[2],
                      }]],
                    },
                  })
                }
              }

              this.logger.debug(results)

              try {
                await this.bot.answerInlineQuery(q.id, results, {
                  cache_time: 3,
                })
                this.logger.info("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success")
              } catch (e) {
                await this.bot.answerInlineQuery(q.id, [{
                  type: "article",
                  title: temp.text("command.search.error")
                    .replace(/{botid}/g, "@" + this.config.bot.username)
                    .replace(/{keyword}/g, match[2]),
                  id: "error",
                  input_message_content: {
                    message_text: temp.inline("command.search.error")
                      .replace(/{botid}/g, "@" + this.config.bot.username)
                      .replace(/{keyword}/g, match[2]),
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                  },
                }], {
                  cache_time: 3,
                })
                this.logger.error("inline: search, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: error")
                this.logger.debug(e.stack)
              }
            }
          } catch (e) {
            await this.bot.answerInlineQuery(q.id, [{
              type: "article",
              title: temp.text("command.search.error")
                .replace(/{botid}/g, "@" + this.config.bot.username)
                .replace(/{keyword}/g, match[2]),
              id: "error",
              input_message_content: {
                message_text: temp.inline("command.search.not_found")
                  .replace(/{botid}/g, "@" + this.config.bot.username)
                  .replace(/{keyword}/g, match[2]),
                parse_mode: "HTML",
                disable_web_page_preview: true,
              },
            }], {
              cache_time: 3,
            })
            this.logger.error("inline: search, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: error")
            this.logger.debug(e.stack)
          }
        }
      } catch (e) {
        this.logger.error("inline: search, ilineid: " + q.id +
          ", username: " + this.helper.getUser(msg.from) +
          ", command: " + msg.query + ", type: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

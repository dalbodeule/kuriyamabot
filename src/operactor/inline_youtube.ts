import * as google from "google-parser";
import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import Lang from "../lang";
import { inline as Inline } from "../operactorBase";

export default class InlineSearch extends Inline {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
  }

  protected async module(msg: Telegram.InlineQuery) {
    const q = {
      id: msg.id, query: msg.query,
    };

    function getdesc(description: string, url: string, title: string, temp: Lang) {
      const shot = url.toString().match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/watch\?v=+([^&]+)/);
      if (shot !== null) {
        return "https://youtu.be/" + shot[1];
      } else if (description === "") {
        return temp.text("command.search.desc_null");
      } else {
        if (description.length > 27) {
          description = description.substr(0, 30) + "...".replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
        }
        return description;
      }
    }

    const match = q.query
      .match(/^(?:([youtube|yt|유튜브]+)(?:| (.*)+))$/);
    if (match) {
      this.logger.info("inline: youtube, inlineid: " + q.id +
        ", username: " + this.helper.getUser(msg.from) +
        ", command: " + msg.query + ", type: pending");
      try {
        const temp = await this.helper.getLang(msg, this.logger);
        if (!match[2]) {
          try {
            await this.bot.answerInlineQuery(q.id, [{
              type: "article",
              title: "@" + this.config.bot.username + " (youtube|yt) (keyword)",
              id: "help",
              input_message_content: {
                message_text: "@" + this.config.bot.username + " (youtube|yt) (keyword)", parse_mode: "HTML", disable_web_page_preview: true,
              },
              reply_markup: {
                inline_keyboard: [[{
                  text: "🔍",
                  switch_inline_query_current_chat: "youtube ",
                }]],
              },
            }], {
              cache_time: 3,
            });
            this.logger.info("inline: youtube, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: success, responseponse: help");
          } catch (e) {
            this.logger.error("inline: youtube, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: error");
            this.logger.debug(e.stack);
          }
        } else {
          try {
            const response = await google.search(match[2] + " site:youtube.com");
            if ((response as google.error).reson == "antibot") {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: "article",
                  title: temp.text("command.search.bot_blcok"),
                  id: "google bot block",
                  input_message_content: {
                    message_text: temp.inline("command.search.bot_blcok"), parse_mode: "HTML", disable_web_page_preview: true,
                  },
                }], {
                  cache_time: 3,
                });
                this.logger.info("inline: youtube, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success, response: google bot block");
              } catch (e) {
                this.logger.error("inline: youtube, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: error");
                this.logger.debug(e.stack);
              }
            } else if (!(response as google.searchReturn[])[0]) {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: "article",
                  title: temp.text("command.search.not_found"),
                  id: "not found",
                  input_message_content: {
                    message_text: temp.inline("command.search.not_found"), parse_mode: "HTML", disable_web_page_preview: true,
                  },
                }], {
                  cache_time: 3,
                });
                this.logger.info("inline: youtube, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success, response: not found");
              } catch (e) {
                this.logger.error("inline: youtube, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: error");
                this.logger.debug(e.stack);
              }
            } else {
              (response as google.searchReturn[]).splice(50);
              const responseults: Telegram.InlineQueryResult[] =  [];
              let i: any = 0;
              for (i in response) {
                responseults.push({
                  type: "article",
                  title: (response as google.searchReturn[])[i].title,
                  id: q.id + "/document/" + i,
                  input_message_content: {
                    message_text: getdesc((response as google.searchReturn[])[i].description, (response as google.searchReturn[])[i].link, (response as google.searchReturn[])[i].title, temp),
                    parse_mode: "HTML",
                  },
                  reply_markup: {
                    inline_keyboard: [[{
                      text: temp.inline("command.search.visit_page"),
                      url: (response as google.searchReturn[])[i].link,
                    }, {
                      text: temp.inline("command.search.another"),
                      switch_inline_query_current_chat: "search " + match[2],
                    }]],
                  },
                });
              }
              try {
                await this.bot.answerInlineQuery(q.id, responseults, {
                  cache_time: 3,
                });
                this.logger.info("inline: youtube, inlineid: " + q.id +
                  ", username: " + this.helper.getUser(msg.from) +
                  ", command: " + msg.query + ", type: success");
              } catch (e) {
                try {
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
                  });
                  this.logger.error("inline: youtube, inlineid: " + q.id +
                    ", username: " + this.helper.getUser(msg.from) +
                    ", command: " + msg.query + ", type: error");
                  this.logger.debug(e.stack);
                } catch (e) {
                  this.logger.error("inline: youtube, inlineid: " + q.id +
                    ", username: " + this.helper.getUser(msg.from) +
                    ", command: " + msg.query + ", type: error send error");
                  this.logger.debug(e.stack);
                }
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
                message_text: temp.inline("command.search.error")
                  .replace(/{botid}/g, "@" + this.config.bot.username)
                  .replace(/{keyword}/g, match[2]),
                parse_mode: "HTML",
                disable_web_page_preview: true,
              },
            }], {
              cache_time: 3,
            });
            this.logger.error("inline: youtube, inlineid: " + q.id +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.query + ", type: error");
            this.logger.debug(e.stack);
          }
        }
      } catch (e) {
        this.logger.error("inline: youtube, inlineid: " + q.id +
          ", username: " + this.helper.getUser(msg.from) +
          ", command: " + msg.query + ", type: error");
        this.logger.debug(e.stack);
      }
    }
  }
}

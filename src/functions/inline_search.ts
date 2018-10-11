import { inline as Inline } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import * as google from 'google-parser'
import { language as Language } from '../types';
import { Logger } from 'log4js';
import { Config } from '../config'

export default class InlineSearch extends Inline {
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
  }

  protected async module (msg: Telegram.InlineQuery) {
    const q = {
      id: msg.id, query: msg.query
    }

    function getdesc (description: string, url: string, title: string, temp: Language.Lang) {
      let shot = url.toString().match(/^https:\/\/(?:www\.|)youtu[.be|be.com]+\/watch\?v=+([^&]+)/)
      if (shot !== null) {
        return 'https://youtu.be/' + shot[1]
      } else if (description === '') {
        return temp.text('command.search.desc_null')
      } else {
        if (description.length > 27) {
          description = description.substr(0, 30) + '...'.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        }
        return description
      }
    }

    const match = q.query
      .match(/^(?:([search|google|query|검색|구글]+)(?:| (.*)+))$/)
    if (match) {
      this.logger.info('inline: search, inlineid: ' + q.id +
        ', username: ' + this.helper.getuser(msg.from) +
        ', command: ' + msg.query + ', type: pending')
      try {
        let temp = await this.helper.getlang(msg, this.logger)
        if (typeof match[2] === 'undefined' || match[2] === '') {
          try {
            await this.bot.answerInlineQuery(q.id, [{
              type: 'article',
              title: '@' + this.config.bot.username +
                ' (search|google|query) (keyword)',
              id: 'help',
              input_message_content: {
                message_text: '@' + this.config.bot.username +
                  ' (search|google|query) (keyword)', parse_mode: 'HTML', disable_web_page_preview: true
              },
              reply_markup: {
                inline_keyboard: [[{
                  text: '🔍',
                  switch_inline_query_current_chat: 'search '
                }]]
              }
            }], {
              cache_time: 3
            })
            this.logger.info('inline: search, inlineid: ' + q.id +
              ', username: ' + this.helper.getuser(msg.from) +
              ', command: ' + msg.query + ', type: success, response: help')
          } catch (e) {
            this.logger.error('inline: search, inlineid: ' + q.id +
              ', username: ' + this.helper.getuser(msg.from) +
              ', command: ' + msg.query + ', type: error')
            this.logger.debug(e.stack)
          }
        } else {
          try {
            let response = await google.search(match[2])
            if ((<google.error>response).reson == 'antibot') {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: temp.inline('command.search.bot_blcok'),
                  id: 'google bot block',
                  input_message_content: {
                    message_text: temp.inline('command.search.bot_blcok'), parse_mode: 'HTML', disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                this.logger.info('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: success, response: google bot block')
              } catch (e) {
                this.logger.error('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: error')
                this.logger.debug(e.stack)
              }
            } else if (!(<Array<google.searchReturn>>response)[0]) {
              try {
                await this.bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: temp.inline('command.search.not_found'),
                  id: 'not found',
                  input_message_content: {
                    message_text: temp.inline('command.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                this.logger.info('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: success, response: not found')
              } catch (e) {
                this.logger.error('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: error')
                this.logger.debug(e.stack)
              }
            } else {
              (<Array<google.searchReturn>>response).splice(50)
              let results: Array<Telegram.InlineQueryResult> = []
              let i: any = 0
              for (i in response) {
                results.push({
                  type: 'article',
                  title: (<Array<google.searchReturn>>response)[i].title,
                  id: q.id + '/document/' + i,
                  input_message_content: {
                    message_text: getdesc((<Array<google.searchReturn>>response)[i]
                      .description, (<Array<google.searchReturn>>response)[i].link,
                      (<Array<google.searchReturn>>response)[i].title, temp),
                    parse_mode: 'HTML'
                  },
                  reply_markup: {
                    inline_keyboard: [[{
                      text: temp.inline('command.search.visit_page'),
                      url: (<Array<google.searchReturn>>response)[i].link
                    }, {
                      text: temp.inline('command.search.another'),
                      switch_inline_query_current_chat: 'search ' + match[2]
                    }]]
                  }
                })
              }
              try {
                await this.bot.answerInlineQuery(q.id, results, {
                  cache_time: 3
                })
                this.logger.info('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: success')
              } catch (e) {
                await this.bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: temp.text('command.search.error')
                    .replace(/{botid}/g, '@' + this.config.bot.username)
                    .replace(/{keyword}/g, match[2]),
                  id: 'error',
                  input_message_content: {
                    message_text: temp.inline('command.search.error')
                      .replace(/{botid}/g, '@' + this.config.bot.username)
                      .replace(/{keyword}/g, match[2]),
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                this.logger.error('inline: search, inlineid: ' + q.id +
                  ', username: ' + this.helper.getuser(msg.from) +
                  ', command: ' + msg.query + ', type: error')
                this.logger.debug(e.stack)
              }
            }
          } catch (e) {
            await this.bot.answerInlineQuery(q.id, [{
              type: 'article',
              title: temp.text('command.search.error')
                .replace(/{botid}/g, '@' + this.config.bot.username)
                .replace(/{keyword}/g, match[2]),
              id: 'error',
              input_message_content: {
                message_text: temp.inline('command.search.not_found')
                  .replace(/{botid}/g, '@' + this.config.bot.username)
                  .replace(/{keyword}/g, match[2]),
                parse_mode: 'HTML',
                disable_web_page_preview: true
              }
            }], {
              cache_time: 3
            })
            this.logger.error('inline: search, inlineid: ' + q.id +
              ', username: ' + this.helper.getuser(msg.from) +
              ', command: ' + msg.query + ', type: error')
            this.logger.debug(e.stack)
          }
        }
      } catch (e) {
        this.logger.error('inline: search, ilineid: ' + q.id +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.query + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

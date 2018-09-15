import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import * as google from 'google-parser'
import { Lang } from '../types';
import config from '../config'

export default (bot: Telegram, logger: Logger) => {
  bot.on('inline_query', async (msg) => {
    const q = {
      id: msg.id, query: msg.query
    }

    function getdesc (description: string, url: string, title: string, temp: Lang) {
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

    const match = q.query.match(/^(?:([youtube|yt|유튜브]+)(?:| (.*)+))$/)
    if (match) {
      let temp
      try {
        temp = await helper.getlang(msg + ' site:youtube.com', logger)
        if (typeof match[2] === 'undefined' || match[2] === '') {
          try {
            await bot.answerInlineQuery(q.id, [{
              type: 'article',
              title: '@' + (<Telegram.User>config.botinfo).username + ' (youtube|yt) (keyword)',
              id: 'help',
              input_message_content: {
                message_text: '@' + (<Telegram.User>config.botinfo).username + ' (youtube|yt) (keyword)', parse_mode: 'HTML', disable_web_page_preview: true
              },
              reply_markup: {
                inline_keyboard: [[{
                  text: '🔍',
                  switch_inline_query_current_chat: 'youtube '
                }]]
              }
            }], {
              cache_time: 3
            })
            logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: not valid, response: help')
          } catch (e) {
            logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
            logger.debug(e.stack)
          }
        } else {
          try {
            let res = await google.search(match[2])
            if ((<google.error>res.reson) == 'antibot') {
              try {
                await bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: temp.text('command.search.bot_blcok'),
                  id: 'google bot block',
                  input_message_content: {
                    message_text: temp.inline('command.search.bot_blcok'), parse_mode: 'HTML', disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid, response: google bot block')
              } catch (e) {
                logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
                logger.debug(e.stack)
              }
            } else if (typeof (<Array<google.searchReturn>>res)[0] === 'undefined') {
              try {
                await bot.answerInlineQuery(q.id, [{
                  type: 'article',
                  title: temp.text('command.search.not_found'),
                  id: 'not found',
                  input_message_content: {
                    message_text: temp.inline('command.search.not_found'), parse_mode: 'HTML', disable_web_page_preview: true
                  }
                }], {
                  cache_time: 3
                })
                logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid, response: not found')
              } catch (e) {
                logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
                logger.debug(e.stack)
              }
            } else {
              (<Array<google.searchReturn>>res).splice(50)
              let results: Array<Telegram.InlineQueryResult> =  []
              let i: any = 0
              for (i in res) {
                results.push({
                  type: 'article',
                  title: (<Array<google.searchReturn>>res)[i].title,
                  id: q.id + '/document/' + i,
                  input_message_content: {
                    message_text: getdesc((<Array<google.searchReturn>>res)[i].description, (<Array<google.searchReturn>>res)[i].link, (<Array<google.searchReturn>>res)[i].title, temp),
                    parse_mode: 'HTML'
                  },
                  reply_markup: {
                    inline_keyboard: [[{
                      text: temp.inline('command.search.visit_page'),
                      url: (<Array<google.searchReturn>>res)[i].link
                    }, {
                      text: temp.inline('command.search.another'),
                      switch_inline_query_current_chat: 'search ' + match[2]
                    }]]
                  }
                })
              }
              try {
                await bot.answerInlineQuery(q.id, results, {
                  cache_time: 3
                })
                logger.info('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: valid')
              } catch (e) {
                console.log(e)
                try {
                  await bot.answerInlineQuery(q.id, [{
                    type: 'article',
                    title: temp.text('command.search.error')
                      .replace(/{botid}/g, '@' + (<Telegram.User>config.botinfo).username)
                      .replace(/{keyword}/g, match[2]),
                    id: 'error',
                    input_message_content: {
                      message_text: temp.inline('command.search.error')
                        .replace(/{botid}/g, '@' + (<Telegram.User>config.botinfo).username)
                        .replace(/{keyword}/g, match[2]),
                      parse_mode: 'HTML',
                      disable_web_page_preview: true
                    }
                  }], {
                    cache_time: 3
                  })
                  logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
                  logger.debug(e.stack)
                } catch (e) {
                  logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error send error')
                  logger.debug(e.stack)
                }
              }
            }
          } catch (e) {
            await bot.answerInlineQuery(q.id, [{
              type: 'article',
              title: temp.text('command.search.error')
                .replace(/{botid}/g, '@' + (<Telegram.User>config.botinfo).username)
                .replace(/{keyword}/g, match[2]),
              id: 'error',
              input_message_content: {
                message_text: temp.inline('command.search.error')
                  .replace(/{botid}/g, '@' + (<Telegram.User>config.botinfo).username)
                  .replace(/{keyword}/g, match[2]),
                parse_mode: 'HTML',
                disable_web_page_preview: true
              }
            }], {
              cache_time: 3
            })
            logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
            logger.debug(e.stack)
          }
        }
      } catch (e) {
        logger.error('inlineid: ' + q.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.query + ', type: error')
        logger.debug(e.stack)
      }
    }
  })
}

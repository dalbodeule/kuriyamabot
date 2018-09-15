import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import * as types from '../types'
import config from '../config'

export default (bot: Telegram, logger: Logger) => {
  bot.onText(/\{(?:gg|문서|검색|구글|google) (.*)(?:\{|\})/, async (msg, match) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    const type = 'google'
    const chatid = msg.chat.id
    let temp
    try {
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + type + ', type: chat command received')
      // eslint-disable-next-line
      let send;
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'typing'),
        helper.getlang(msg, logger)
      ])
      let res = await helper.search((<RegExpExecArray>match)[1])
      if (res === '') {
        await bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.not_found'), {reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + type + ', type: valid, response: not found')
      } else if (res === false) {
        await bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.bot_block'), {reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + type + ', type: valid, response: google bot block')
      } else {
        try {
          await bot.sendMessage(chatid, (<string>res), {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.search.visit_google'),
                url: 'https://www.google.com/search?q=' + encodeURIComponent((<RegExpExecArray>match)[1]) + '&ie=UTF-8'
              }, {
                text: temp.text('command.img.another'),
                switch_inline_query_current_chat: 'img ' + (<RegExpExecArray>match)[1]
              }]]
            }
          })
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + type + ', type: valid, response: search success')
        } catch (e) {
          sendError(e, chatid, temp, msg, match)
        }
      }
    } catch (e) {
      sendError(e, chatid, temp, msg, match)
    }
    async function sendError (e: Error, chatid: number, temp: types.Lang | undefined, msg: Telegram.Message, match: RegExpExecArray | null) {
      logger.error('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + msg.text + ', type: valid, response: message send error')
      logger.debug(e.stack)
      try {
        await bot.sendMessage(chatid, '❗️ ' + (<types.Lang>temp).text('command.search.error')
          .replace(/{botid}/g, (<string>(<Telegram.User>config.botinfo).username))
          .replace(/{keyword}/g, (<RegExpExecArray>match)[1]), {
          reply_markup: {
            inline_keyboard: [[{
              text: '@' + (<Telegram.User>config.botinfo).username + ' search ' + (<RegExpExecArray>match)[1],
              switch_inline_query_current_chat: 'search ' + (<RegExpExecArray>match)[1]
            }]]
          },
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML'
        })
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser((<Telegram.User>msg.from)) + ', lang: ' + (<Telegram.User>msg.from).language_code + ', chat command: ' + msg.text + ', type: valid, response: message send error send error')
        logger.debug(e.stack)
      }
    }
  })
}

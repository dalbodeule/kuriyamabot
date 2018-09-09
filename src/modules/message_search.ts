import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

export default (bot: Telegram, logger: Logger) => {
  bot.on('message', async (msg) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.reply_to_message) return
    if (msg.reply_to_message.from.username !== global.botinfo.username) return
    if (Math.round((new Date()).getTime() / 1000) - msg.reply_to_message.date >= 60) return
    if (!msg.reply_to_message) return
    if (!msg.reply_to_message.text) return
    if (!msg.reply_to_message.text.match(/🔍❗️/)) return

    const chatid = msg.chat.id
    let temp
    try {
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received')
      // eslint-disable-next-line
      let send;
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'typing'),
        helper.getlang(msg, logger)
      ])
      let response = await helper.search(msg.text)
      if (response === '') {
        await bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.not_found'), {reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid, response: not found')
      } else if (response === false) {
        bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.not_found'), {reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid, response: google bot block')
      } else {
        try {
          await bot.sendMessage(chatid, '🔍 ' + temp.text('command.search.result') +
            '\n' + response, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.search.another'),
                url: 'https://www.google.com/search?q=' + encodeURIComponent(msg.text) + '&ie=UTF-8'
              }, {
                text: temp.text('command.search.another'),
                switch_inline_query_current_chat: 'search ' + msg.text
              }]]
            }
          })
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid, response: search success')
        } catch (e) {
          sendError(e, chatid, temp, msg)
        }
      }
    } catch (e) {
      sendError(e, chatid, temp, msg)
    }
    async function sendError (e, chatid, temp, msg) {
      logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid, response: message send error')
      logger.debug(e.stack)
      try {
        await bot.sendMessage(chatid, '❗️ ' + temp.text('command.search.error')
          .replace(/{botid}/g, '@' + global.botinfo.username).replace(/{keyword}/g, msg.text), {
          reply_markup: {
            inline_keyboard: [[{
              text: '@' + global.botinfo.username + ' search ' + msg.text,
              switch_inline_query_current_chat: 'search ' + msg.text
            }]]
          },
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML'
        })
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid, response: message send error')
        logger.debug(e.stack)
      }
    }
  })
}

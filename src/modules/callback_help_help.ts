import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import * as types from '../types'

export default (bot: Telegram, logger: Logger) => {
  const answer = (msg: Telegram.CallbackQuery, temp: types.Lang) => {
    bot.answerCallbackQuery(msg.id, {
      text: temp.text('command.help.twice')
    })
  }

  bot.on('callback_query', async (msg) => {
    const callid = msg.id
    let temp
    try {
      temp = await helper.getlang(msg, logger)
      if (msg.data === 'help') {
        if (msg.message.text !== '📒 ' + temp.help('command.help.help')) {
          try {
            await bot.editMessageText('📒 ' + temp.help('command.help.help'), {chat_id: msg.message.chat.id,
              message_id: msg.message.message_id,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: helper.commandlist(temp)}})
            logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
          } catch (e) {
            logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error')
            logger.debug(e)
          }
        } else {
          answer(msg, temp)
        }
      }
      logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: callback received')
    } catch (e) {
      logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
      logger.debug(e)
    }
  })
}

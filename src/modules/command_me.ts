import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'
import config from '../config'

export default (bot: Telegram, logger: Logger) => {
  bot.onText(new RegExp('^/(?:정보|me)+(?:@' + (<Telegram.User>config.botinfo).username + ')? ?$'), async (msg, match) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
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
        await bot.sendMessage(chatid, '📟 ' + temp.text('command.me')
          .replace(/{userid}/g, msg.from.id)
          .replace(/{fname}/g, (typeof msg.from.first_name === 'undefined' ? 'none' : msg.from.first_name))
          .replace(/{lname}/g, (typeof msg.from.last_name === 'undefined' ? 'none' : msg.from.last_name))
          .replace(/{name}/g, (typeof msg.from.username === 'undefined' ? 'none' : '@' + msg.from.username))
          .replace(/{lang}/g, temp.lang), {
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML'
        })
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid,')
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
        logger.debug(e.stack)
      }
    }
  })
}

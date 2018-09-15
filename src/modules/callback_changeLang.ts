import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

export default (bot: Telegram, logger: Logger) => {
  bot.on('callback_query', async (msg: Telegram.CallbackQuery) => {
    let test = (<string>msg.data).match(/changelang_([a-zA-Z]{2})/)
    if (test) {
      const callid = msg.id
      let temp
      try {
        logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: callback received')
        try {
          if ((<Telegram.Message>msg.message).chat.type === 'private') {
            temp = await helper.getlang(msg, logger)
            await temp.langset(test[1])
            await bot.editMessageText(temp.text('command.lang.success'), {chat_id: (<Telegram.Message>msg.message).chat.id,
              message_id: (<Telegram.Message>msg.message).message_id,
              parse_mode: 'HTML'
            })
            logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
          } else {
            // eslint-disable-next-line
            let admins, isAdmin = false;
            [temp, admins] = await Promise.all([
              helper.getlang(msg, logger),
              bot.getChatAdministrators((<Telegram.Message>msg.message).chat.id)
            ])
            isAdmin = admins.some((v) => {
              return v.user.id === msg.from.id
            })
            if (isAdmin) {
              temp = await helper.getlang(msg, logger)
              await temp.langset(test[1])
              await bot.editMessageText(temp.text('command.lang.success'), {chat_id: (<Telegram.Message>msg.message).chat.id,
                message_id: (<Telegram.Message>msg.message).message_id,
                parse_mode: 'HTML'
              })
              logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
            } else {
              await bot.editMessageText(temp.text('command.lowPermission'), {chat_id: (<Telegram.Message>msg.message).chat.id,
                message_id: (<Telegram.Message>msg.message).message_id,
                parse_mode: 'HTML'
              })
              logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: lowPermission')
            }
          }
        } catch (e) {
          logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error')
          logger.debug(e)
        }
      } catch (e) {
        logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error')
        logger.debug(e)
      }
    }
  })
}

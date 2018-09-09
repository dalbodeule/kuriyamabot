import * as model from '../db'

import helper from '../helper'
import { Logger } from 'log4js'
import * as Telegram from 'node-telegram-bot-api'

export default (bot: Telegram, logger: Logger) => {
  bot.onText(new RegExp('^/leave+(?:@' + global.botinfo.username + ')? ([^\r]+)$'), async (msg, match) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      let temp
      try {
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: command received')
        // eslint-disable-next-line
        let send, admins, isAdmin = false;
        [send, temp, admins] = await Promise.all([
          bot.sendChatAction(chatid, 'typing'),
          helper.getlang(msg, logger),
          bot.getChatAdministrators(chatid)
        ])
        if (msg.chat.type === 'private') {
          await bot.sendMessage(chatid, '❗️ ' + temp.text('command.isnotgroup'))
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup')
        } else {
          isAdmin = admins.some((v) => {
            return v.user.id === msg.from.id
          })
          if (!isAdmin) {
            await bot.sendMessage(chatid, '❗️ ' + temp.text('command.lowPermission'))
            logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: lowPermission')
          } else {
            let value = await model.message.findLeave(chatid)
            if (!value) {
              await model.message.createLeave(chatid, match[1])
              await bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                reply_to_message_id: msg.message_id
              })
              logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: create success')
            } else {
              if (value && !value.leaveMessage) {
                await model.message.updateLeave(chatid, match[1])
                await bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                  reply_to_message_id: msg.message_id
                })
                logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: update success')
              } else {
                await model.message.updateLeave(chatid, match[1])
                await bot.sendMessage(chatid, ' ' + temp.text('command.leave.success'), {
                  reply_to_message_id: msg.message_id
                })
                logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: update success')
              }
            }
          }
        }
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
        logger.debug(e.stack)
      }
    }
  })

  bot.onText(new RegExp('^/leave+(?:@' + global.botinfo.username + ')? ?$'), async (msg, match) => {
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
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
          await bot.sendMessage(chatid, '❗️ ' + temp.text('command.isnotgroup'))
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup')
        } else {
          await bot.sendMessage(chatid, '🔧 ' + temp.text('command.leave.help'), {
            reply_to_message_id: msg.message_id,
            parse_mode: 'Markdown'
          })
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid,')
        }
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
        logger.debug(e.stack)
      }
    }
  })
}

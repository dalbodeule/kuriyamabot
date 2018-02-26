const db = require('../db')

module.exports = (bot, logger, helper) => {
  bot.onText(new RegExp('^/leave+(?:@' + global.botinfo.username + ')? (.*)$'), async (msg, match) => {
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
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
          await bot.sendMessage(chatid, '❗️ ' + temp.group('command.isnotgroup'))
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup')
        } else {
          isAdmin = admins.some((v) => {
            return v.user.id === msg.from.id
          })
          if (!isAdmin) {
            await bot.sendMessage(chatid, '❗️ ' + temp.group('command.lowPermission'))
            logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: lowPermission')
          } else {
            let value = await db.message.findOne({
              where: {
                id: chatid
              }
            })
            if (!value) {
              await db.message.create({
                id: chatid,
                leaveMessage: match[1]
              })
              await bot.sendMessage(chatid, ' ' + temp.group('command.leave.success'), {
                reply_to_message_id: msg.message_id
              })
              logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: create success')
            } else {
              value = value.get({plain: true})
              if (Array.isArray(value) && value.leaveMessage) {
                await db.message.create({
                  id: chatid,
                  leaveMessage: match[1]
                })
                await bot.sendMessage(chatid, ' ' + temp.group('command.leave.success'), {
                  reply_to_message_id: msg.message_id
                })
                logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: create success')
              } else {
                await db.message.update({
                  leaveMessage: match[1]
                }, {
                  where: {
                    id: chatid
                  }
                })
                await bot.sendMessage(chatid, ' ' + temp.group('command.leave.success'), {
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
          await bot.sendMessage(chatid, '❗️ ' + temp.group('command.isnotgroup'))
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: isnotgroup')
        } else {
          await bot.sendMessage(chatid, '🔧 ' + temp.group('command.leave.help'), {
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

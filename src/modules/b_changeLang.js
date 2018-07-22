module.exports = (bot, logger, helper) => {
  bot.on('callback_query', async (msg) => {
    let test = msg.data.match(/changelang_([a-zA-Z]{2})/)
    if (test) {
      const callid = msg.id
      let temp
      try {
        logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: callback received')
        try {
          // eslint-disable-next-line
          let send, admins, isAdmin = false;
          [send, temp, admins] = await Promise.all([
            bot.sendChatAction(msg.chat.id, 'typing'),
            helper.getlang(msg, logger),
            bot.getChatAdministrators(msg.chat.id)
          ])
          if (msg.chat.type === 'private') {
            temp = await helper.getlang(msg, logger)
            await temp.langset(test[1])
            await bot.editMessageText(temp.text('command.lang.success'), {chat_id: msg.message.chat.id,
              message_id: msg.message.message_id,
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
            logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
          } else {
            isAdmin = admins.some((v) => {
              return v.user.id === msg.from.id
            })
            if (isAdmin) {
              temp = await helper.getlang(msg, logger)
              await temp.langset(test[1])
              await bot.editMessageText(temp.text('command.lang.success'), {chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                reply_to_message_id: msg.message_id,
                parse_mode: 'HTML'
              })
              logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
            } else {
              await bot.editMessageText(temp.text('command.lowPermission'), {chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                reply_to_message_id: msg.message_id,
                parse_mode: 'HTML'
              })
              logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: lowPermission')
            }
          }
        } catch (e) {
          try {
            await bot.editMessageText('❗️ ' + temp.text('command.lang.error'), {chat_id: msg.message.chat.id,
              message_id: msg.message.message_id,
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML'
            })
            logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error')
            logger.debug(e.stack)
          } catch (e) {
            logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error send error')
            logger.debug(e.stack)
          }
        }
      } catch (e) {
        logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
        logger.debug(e.message)
      }
    }
  })
}

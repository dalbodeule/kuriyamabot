module.exports = (bot, logger, helper) => {
  const answer = (msg, temp) => {
    bot.answerCallbackQuery(msg.id, temp.text('command.help.twice'))
  }

  bot.on('callback_query', async (msg) => {
    const callid = msg.id
    let temp
    try {
      temp = await helper.getlang(msg, logger)
      if (msg.data === 'help_start') {
        if (msg.message.text !== '👋 ' + temp.help('command.help.start')) {
          try {
            temp = await helper.getlang(msg, logger)
            await bot.editMessageText('👋 ' + temp.help('command.help.start'), {chat_id: msg.message.chat.id,
              message_id: msg.message.message_id,
              reply_to_message_id: msg.message_id,
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: helper.commandlist(temp)
              }})
            logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: valid')
          } catch (e) {
            logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: error')
            logger.debug(e.stack)
          }
        } else {
          answer(msg, temp)
        }
      }
      logger.info('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.data + ', type: callback received')
    } catch (e) {
      logger.error('callback id: ' + callid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
      logger.debug(e.message)
    }
  })
}

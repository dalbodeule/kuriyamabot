module.exports = (bot, logger, helper) => {
  bot.onText(new RegExp('^/(?:무슨애니|whatanime)+(?:@' + global.botinfo.username + ')? ?$'), async (msg, match) => {
    if (msg.photo) {
      if (/^(?:무슨애니|whatanime|\/무슨애니|\/whatanime|무슨애니\?|anime)$/.test(msg.text)) return
      if (msg.reply_to_message) return
      if (msg.reply_to_message.photo) return
    } else {
      if (/^(?:무슨애니|whatanime|\/무슨애니|\/whatanime|무슨애니\?|anime)$/.test(msg.caption)) {
        if (msg.reply_to_message) return
        if (msg.reply_to_message.photo) return
        if (msg.reply_to_message.from.username == global.botinfo.username) return
        if (Math.round((new Date()).getTime() / 1000) - msg.reply_to_message.date >= 60) return
        if (msg.reply_to_message.text.match(/📺❗️/)) return
      }
    }
      const chatid = msg.chat.id
      let temp
      try {
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: command received')
        // eslint-disable-next-line
        let send;
        [send, temp] = await Promise.all([
          bot.sendChatAction(chatid, 'typing'),
          helper.getlang(msg, logger)
        ])
        await bot.sendMessage(chatid, '📺❗️ ' + temp.text(msg.chat.type, 'command.whatanime.info'), {
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            force_reply: true, selective: true
          }
        })
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: valid,')
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error')
        logger.debug(e.stack)
      }
    }
  })
}

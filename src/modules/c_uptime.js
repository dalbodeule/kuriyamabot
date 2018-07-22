module.exports = (bot, logger, helper) => {
  const Format = require('../helper/timeFormat')

  bot.onText(new RegExp('^/(?:작동시간|uptime)+(?:@' + global.botinfo.username + ')? ?$'), async (msg, match) => {
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
        let uptime = new Format(process.uptime())
        await bot.sendMessage(chatid, '✅ ' + temp.text('command.uptime.message')
          .replace(/{hour}/g, uptime.hour)
          .replace(/{min}/g, uptime.min)
          .replace(/{sec}/g, uptime.sec), {
          reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: valid')
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: ' + msg.text + ', type: error')
        logger.debug(e.stack)
      }
    }
  })
}

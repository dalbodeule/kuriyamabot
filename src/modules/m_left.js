const db = require('../db')

module.exports = (bot, logger, helper) => {
  bot.on('message', async (msg) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.left_chat_member) return
    const chatid = msg.chat.id
    let temp
    try {
      if (msg.left_chat_member.id !== global.botinfo.id) {
        // eslint-disable-next-line
        let send;
        [send, temp] = await Promise.all([
          bot.sendChatAction(chatid, 'typing'),
          helper.getlang(msg, logger)
        ])
        let value = await db.message.findOne({
          where: {
            id: chatid
          },
          raw: true
        })
        if (!value) {
          await bot.sendMessage(chatid, temp.text(msg.chat.type, 'message.left')
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.left_chat_member.first_name), {
            reply_to_message_id: msg.message_id
          })
          logger.info('message: chat left, chatid: ' + chatid + ', userid: ' + msg.left_chat_member.id + ', username: ' + msg.from.username)
        } else if (value.leaveMessage === 'off') {
          logger.info('message: chat left, chatid: ' + chatid + ', userid: ' + msg.left_chat_member.id + ', username: ' + msg.from.username)
        } else {
          value = value.get({plain: true})
          let leaveMessage = value.leaveMessage || temp.text(msg.chat.type, 'message.left')
          await bot.sendMessage(chatid, leaveMessage
            .replace(/{roomid}/g, msg.chat.title)
            .replace(/{userid}/g, msg.left_chat_member.first_name), {
            reply_to_message_id: msg.message_id
          })
          logger.info('message: chat left, chatid: ' + chatid + ', userid: ' + msg.left_chat_member.id + ', username: ' + msg.from.username)
        }
      } else {
        logger.info('message: chat left, chatid: ' + chatid + ', I\'m has left')
      }
    } catch (e) {
      logger.error('message: chat left, chatid: ' + chatid + ', userid: ' + msg.left_chat_member.id + ', username: ' + msg.from.username + ' status: error')
      logger.debug(e.stack)
    }
  })
}

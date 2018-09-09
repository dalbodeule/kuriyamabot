module.exports = (bot, logger, helper) => {
  bot.onText(/\{(?:img|pic|사진|이미지|짤) (.*)(?:\{|\})/, async (msg, match) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    const type = 'pic'
    const chatid = msg.chat.id
    let temp
    try {
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: chat command received')
      // eslint-disable-next-line
      let send;
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'upload_photo'),
        helper.getlang(msg, logger)
      ])
      let res = await helper.image(match[1])
      if (typeof (res) === 'undefined') {
        await bot.sendChatAction(chatid, 'typing')
        await bot.sendMessage(chatid, '🖼 ' + temp.text('command.img.not_found'), {reply_to_message_id: msg.message_id})
        logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: valid, response: image not found')
      } else {
        try {
          await bot.sendChatAction(chatid, 'upload_photo')
          await bot.sendPhoto(chatid, res.img, {
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text('command.img.visit_page'),
                url: res.url
              }, {
                text: temp.text('command.img.view_image'),
                url: res.img
              }], [{
                text: temp.text('command.img.another'),
                switch_inline_query_current_chat: 'img ' + match[1]
              }]]
            },
            reply_to_message_id: msg.message_id
          })
          logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: valid, response: image search success')
        } catch (e) {
          try {
            await bot.sendChatAction(chatid, 'upload_photo')
            res = await helper.image(match[1])
            await bot.sendPhoto(chatid, res.img, {
              reply_markup: {
                inline_keyboard: [[{
                  text: temp.text('command.img.visit_page'),
                  url: res.url
                }, {
                  text: temp.text('command.img.view_image'),
                  url: res.img
                }], [{
                  text: temp.text('command.img.another'),
                  switch_inline_query_current_chat: 'img ' + match[1]
                }]]
              },
              reply_to_message_id: msg.message_id
            })
            logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: valid, response: image search success')
          } catch (e) {
            sendError(e, chatid, temp, msg, match, type)
          }
        }
      }
    } catch (e) {
      sendError(e, chatid, temp, msg, match, type)
    }
    async function sendError (e, chatid, temp, msg, match, type) {
      logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: valid, response: message send error')
      logger.debug(e.stack)
      try {
        await bot.sendChatAction(chatid, 'typing')
        await bot.sendMessage(chatid, '❗️ ' + temp.text('command.img.error')
          .replace(/{botid}/g, '@' + global.botinfo.username)
          .replace(/{keyword}/g, match[1]), {
          reply_markup: {
            inline_keyboard: [[{
              text: '@' + global.botinfo.username + ' img ' + match[1],
              switch_inline_query_current_chat: 'img ' + match[1]
            }]]
          },
          reply_to_message_id: msg.message_id,
          parse_mode: 'HTML'
        })
      } catch (e) {
        logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', chat command: ' + type + ', type: valid, response: message send error send error')
        logger.debug(e.stack)
      }
    }
  })
}

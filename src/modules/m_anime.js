module.exports = (bot, logger, helper) => {
  const Whatanime = require('whatanimega-helper')
  const Format = require('../helper/timeFormat')

  const query = new Whatanime(global.config.apikey.whatanime)

  const failure = async (chatid, msg) => {
    let temp
    try {
      // eslint-disable-next-line
      let send
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'typing'),
        helper.getlang(msg, logger)
      ])
      await bot.sendMessage(chatid, '📺❗️ ' + temp.text('command.whatanime.info'), {
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

  const success = async (chatid, msg, photo) => {
    let temp
    try {
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: command received')
      // eslint-disable-next-line
      let send
      [send, temp] = await Promise.all([
        bot.sendChatAction(chatid, 'typing'),
        helper.getlang(msg, logger)
      ])

      const url = await bot.getFileLink(photo)
      const response = await query.search(url)
      const result = response.docs[0]
      let resultMessage = ''
      if (result.anime.toLowerCase() !== result.title_english.toLowerCase()) {
        resultMessage = temp.text('command.whatanime.name') + ': <code>' + result.title_native + '</code>\n' +
          temp.text('command.whatanime.english') + ': <code>' + result.title_english + '</code>\n'
      } else {
        resultMessage = temp.text('command.whatanime.name') + ': <code>' + result.title_native + '</code>\n'
      }
      const time = new Format(result.at)
      resultMessage = resultMessage +
        temp.text('command.whatanime.episode') + ' <code>' + result.episode + '</code>\n' +
        temp.text('command.whatanime.time') + ': <code>' +
        (time.hour === '00' ? '' : time.hour + ' : ') + time.min + ' : ' + time.sec + '</code>\n' +
        temp.text('command.whatanime.match') + ': <code>' + (result.similarity * 100).toFixed(2) + '</code>%'
      if (result.similarity < 0.9) {
        resultMessage = resultMessage + '\n\n<b>' + temp.text('command.whatanime.incorrect') + '</b>'
      }
      if (result.is_adult) {
        resultMessage = resultMessage + '\n\n<b>' + temp.text('command.whatanime.isAdult') + '</b>'
        await bot.sendMessage(chatid, resultMessage, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_to_message_id: msg.message_id
        })
      } else {
        const animeVideo = await query.previewVideo(result.season, result.anime, result.filename, result.at, result.tokenthumb)
        await Promise.all([
          bot.sendMessage(chatid, resultMessage, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id
          }),
          bot.sendVideo(chatid, animeVideo, {
            reply_to_message_id: msg.message_id
          })
        ])
      }
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: valid')
    } catch (e) {
      logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error')
      logger.debug(e.stack)
    }
  }

  bot.on('message', async (msg) => {
    const regex1 = new RegExp('^(?:무슨 ?애니|whatanime|anime|/(?:무슨애니|whatanime)+(?:@' + global.botinfo.username + ')? ?)$')
    const regex2 = new RegExp('/(?:무슨애니|whatanime)+(?:@' + global.botinfo.username + ')? ?$')
    try {
      if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
      if (msg.photo) {
        if (regex1.test(msg.caption)) {
          await success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id)
          return
        } else if (msg.reply_to_message && msg.reply_to_message.from &&
          msg.reply_to_message.from.username === global.botinfo.username &&
          msg.reply_to_message.text &&
          msg.reply_to_message.text.match(/📺❗️/)) {
          await success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id)
          return
        }
      } else if (msg.video && msg.document.thumb) {
        if (regex1.test(msg.caption)) {
          await success(msg.chat.id, msg, msg.document.thumb.file_id)
          return
        } else if (msg.reply_to_message && msg.reply_to_message.from &&
          msg.reply_to_message.from.username === global.botinfo.username &&
          msg.reply_to_message.text &&
          msg.reply_to_message.text.match(/📺❗️/)) {
          await success(msg.chat.id, msg, msg.document.thumb.file_id)
          return
        }
      } else {
        if (regex1.test(msg.text)) {
          if (msg.reply_to_message && msg.reply_to_message.photo) {
            await success(msg.chat.id, msg, msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id)
            return
          } else if (msg.reply_to_message && msg.reply_to_message.document && msg.reply_to_message.document.thumb) {
            await success(msg.chat.id, msg, msg.reply_to_message.document.thumb.file_id)
            return
          } else if (msg.reply_to_message && msg.reply_to_message.video && msg.reply_to_message.document.video) {
            await success(msg.chat.id, msg, msg.reply_to_message.video.thumb.file_id)
            return
          }
        } else if (regex2.test(msg.text)) {
          await failure(msg.chat.id, msg)
          return
        }
      }
    } catch (e) {
      logger.error('chatid: ' + msg.chat.id + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error')
      logger.debug(e.stack)
    }
  })
}

module.exports = (bot, logger, helper) => {
  const Whatanime = require('whatanimega-helper')

  const Format = class {
    constructor (time) {
      this.time = time
      return true
    }
    get hour () {
      return this.pad(Math.floor(this.time / (60 * 60)))
    }
    get min () {
      return this.pad(Math.floor(this.time % (60 * 60) / 60))
    }
    get sec () {
      return this.pad(Math.floor(this.time % 60))
    }
    pad (s) {
      return (s < 10 ? '0' : '') + s
    }
  }

  const failure = async (chatid, msg) => {
    let temp
    try {
      // eslint-disable-next-line
      let send
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

      const query = new Whatanime(global.config.apikey.whatanime)

      const url = await bot.getFileLink(photo)
      const response = await query.search(url)
      const result = response.docs[0]
      let resultMessage = ''
      if (result.anime.toLowerCase() !== result.title_english.toLowerCase()) {
        resultMessage = temp.textb(msg.chat.type, 'command.whatanime.name') + ': ' + result.title + '\n' +
          temp.textb(msg.chat.type, 'command.whatanime.english') + ': ' + result.title_english + '\n'
      } else {
        resultMessage = temp.textb(msg.chat.type, 'command.whatanime.name') + ': ' + result.anime + '\n'
      }
      const time = new Format(result.at)
      resultMessage = resultMessage +
        temp.textb(msg.chat.type, 'command.whatanime.episode') + ' ' + result.episode + '\n' +
        temp.textb(msg.chat.type, 'command.whatanime.time') + ': ' +
        (time.hour === '00' ? '' : time.hour + ' : ') + time.min + ' : ' + time.sec + '\n' +
        temp.textb(msg.chat.type, 'command.whatanime.match') + ': ' + (result.similarity * 100).toFixed(2) + '%'
      if (result.similarity * 100 > 70) {
        await bot.sendMessage(chatid, resultMessage + '\n' + temp.text(msg.chat.type, 'command.whatanime.incorrect'), {
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
    try {
      if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
      if (msg.photo) {
        if (/^(?:무슨애니|whatanime|\/무슨애니|\/whatanime|무슨애니\?|anime)$/.test(msg.caption)) {
          await success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id)
          return
        } else if (msg.reply_to_message.from.username === global.botinfo.username &&
          msg.reply_to_message.text.match(/📺❗️/)) {
          await success(msg.chat.id, msg, msg.photo[msg.photo.length - 1].file_id)
          return
        }
      } else {
        if (/^(?:무슨애니|whatanime|\/무슨애니|\/whatanime|무슨애니\?|anime)$/.test(msg.text) &&
          msg.reply_to_message && msg.reply_to_message.photo) {
          await success(msg.chat.id, msg, msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id)
          return
        } else if (/^\/(?:무슨애니|\/whatanime)$/.test(msg.text)) {
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

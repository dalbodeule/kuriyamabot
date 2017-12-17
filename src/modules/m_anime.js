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

  bot.on('message', async (msg) => {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    if (!msg.photo) return
    if (!/^(?:무슨애니|whatanime|\/무슨애니|\/whatanime|무슨애니\?|anime)$/.test(msg.caption)) {
      if (!msg.reply_to_message) return
      if (msg.reply_to_message.from.username !== global.botinfo.username) return
      if (Math.round((new Date()).getTime() / 1000) - msg.reply_to_message.date >= 60) return
      if (!msg.reply_to_message.text.match(/📺❗️/)) return
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

      const query = new Whatanime(global.config.apikey.whatanime)

      const url = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id)
      const response = await query.search(url)
      const result = response.docs[0]
      let resultMessage = ''
      if (result.anime.toLowerCase() !== result.title_english.toLowerCase()) {
        resultMessage = temp.textb(msg.chat.type, 'command.whatanime.name') + ': ' + result.anime + '\n' +
          temp.textb(msg.chat.type, 'command.whatanime.english') + ': ' + result.title_english + '\n'
      } else {
        resultMessage = temp.textb(msg.chat.type, 'command.whatanime.name') + ': ' + result.anime + '\n'
      }
      const time = new Format(result.at)
      resultMessage = resultMessage +
        temp.textb(msg.chat.type, 'command.whatanime.episode') + ' ' + result.episode + '\n' +
        temp.textb(msg.chat.type, 'command.whatanime.time') + ' ' +
        (time.hour === 0 ? '' : time.hour + ' : ') + time.min + ' : ' + time.sec +
        temp.textb(msg.chat.type, 'command.whatanime.match') + ': ' + (result.similarity * 100).toFixed(2) + '%'
      await bot.sendMessage(chatid, resultMessage, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_to_message_id: msg.message_id
      })
      logger.info('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: valid')
    } catch (e) {
      logger.error('chatid: ' + chatid + ', username: ' + helper.getuser(msg.from) + ', lang: ' + msg.from.language_code + ', command: whatanime, type: error')
      logger.debug(e.stack)
    }
  })
}

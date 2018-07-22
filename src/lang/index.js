const objectPath = require('object-path')
const language = require('languages')
const model = require('../db')
const glob = require('glob-promise')
const path = require('path')
const langs = {}

module.exports = class {
  constructor () {
    this.id = ''
    this.lang = ''
    this.logger = ''
    this.ready = false
  }

  async set (msg, logger) {
    if (Object.keys(langs).length === 0) {
      logger.info('Language: Language not loaded')
      let items = await glob(path.join(__dirname, 'lang_*.js'))
      for (let i of items) {
        let temp = require(i)
        langs[temp.lang.langname] = temp
        logger.info('Language: "' + temp.lang.langname + '" Load complete')
      }
      logger.info('Language: Language load complete')
      this.ready = true
    } else {
      this.ready = true
    }

    if (msg.message) { // callback query 대응
      this.id = (msg.message.chat.type === 'private' ? msg.message.from.id : msg.message.chat.id)
      this.logger = logger
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = msg.message.from.language_code.split('-')[0]
        logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return query
      } else {
        this.lang = query.lang
        logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return query
      }
    } else {
      this.id = (msg.chat.type === 'private' ? msg.from.id : msg.chat.id)
      this.logger = logger
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = msg.from.language_code.split('-')[0]
        logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return query
      } else {
        this.lang = query.lang
        logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return query
      }
    }
  }

  async langset (lang) {
    let isExist = false
    for (let i in Object.keys(langs)) {
      if (langs[Object.keys(langs)[i]].lang.code === lang) {
        isExist = true
      }
    }
    if (isExist === false) {
      throw Error(lang + ' is not a valid value')
    }
    try {
      await model.language.update(lang, this.id)
      this.lang = lang
      this.logger.debug({id: this.id, lang: this.lang})
      return true
    } catch (e) {
      throw (e)
    }
  }

  inline (code) {
    if (typeof this.lang === 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] === 'undefined') {
      return objectPath.get(langs.Korean, code) + '(' + objectPath.get(langs.English, code) + ')'
    } else if (language.getLanguageInfo(this.lang).name === 'English') {
      return objectPath.get(langs.English, code)
    } else {
      return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code) +
        '(' + objectPath.get(langs.English, code) + ')'
    }
  }

  help (code) {
    if (typeof this.lang === 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] === 'undefined') {
      return objectPath.get(langs.Korean, code + '.name') + '\n\n' +
        objectPath.get(langs.Korean, code + '.description') + '\n\n' +
        objectPath.get(langs.Korean, code + '.how').replace(/{botid}/g, '@' + global.botinfo.username) +
        ' ( ' + objectPath.get(langs.English, code + '.how').replace(/{botid}/g, '@' + global.botinfo.username) + ' )'
    }
  }

  text (code) {
    return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code)
  }

  getLangList () {
    return langs
  }
}

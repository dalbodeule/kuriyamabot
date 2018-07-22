const objectPath = require('object-path')
const language = require('languages')
const db = require('../db')
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

    if (typeof msg.from.language_code === 'undefined') {
      return undefined
    } else {
      this.id = msg.from.id
      this.logger = logger
      let query = await db.user.findOne({
        where: {
          id: this.id
        },
        attributes: [
          'id',
          'lang'
        ]
      })
      if (!query || !query.get || !query.get('lang')) {
        this.lang = msg.from.language_code.split('-')[0]
        logger.debug(this.id + ' ' + this.lang)
        db.user.create({
          id: this.id,
          lang: this.lang
        })
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
    await db.user.update({
      lang: lang
    }, {
      where: {
        id: this.id
      }
    })
    this.lang = lang
    this.logger.debug({id: this.id, lang: this.lang})
    return true
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

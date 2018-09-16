import * as objectPath from 'object-path'
import * as language from 'languages'
import * as model from '../db'
import * as glob from 'glob-promise'
import * as path from 'path'
import { Logger } from 'log4js';
import { Langs } from '../types'
import { config } from '../config';

const langs: Langs = {}

export default class {
  id: number;
  lang: string;
  logger: Logger;
  ready: boolean;

  constructor (logger: Logger) {
    this.id = 0
    this.lang = ''
    this.logger = logger
    this.ready = false
  }

  async set (msg: any): Promise<void> {
    if (Object.keys(langs).length === 0) {
      this.logger.info('Language: Language not loaded')
      let items = await glob(path.join(__dirname, 'lang_*.json'))
      for (let i of items) {
        let temp = require(i)
        langs[temp.lang.langname] = temp
        this.logger.info('Language: "' + temp.lang.langname + '" Load complete')
      }
      this.logger.info('Language: Language load complete')
      this.ready = true
    } else {
      this.ready = true
    }

    if (msg.from && msg.from.language_code) { // 일반 채팅 대응
      this.id = (msg.chat.type === 'private' ? msg.from.id : msg.chat.id)
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = msg.from.language_code.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return query
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return query
      }
    } else if (msg.message) { // callback query 대응
      this.id = (msg.message.chat.type === 'private' ? msg.from.id : msg.message.chat.id)
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = msg.from.language_code.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return query
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return query
      }
    } else { // inline query 대응
      this.id = msg.from.id
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = msg.from.language_code.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return query
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return query
      }
    }
  }

  async langset (lang: string): Promise<boolean> {
    let isExist = false
    for (let i in Object.keys(langs)) {
      if ((<string>langs[Object.keys(langs)[i]].lang.code) === lang) {
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

  inline (code: string): string {
    if (typeof this.lang === 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] === 'undefined') {
      return (<string>objectPath.get(langs.Korean, code)) + '(' + (<string>objectPath.get(langs.English, code)) + ')'
    } else if (language.getLanguageInfo(this.lang).name === 'English') {
      return (<string>objectPath.get(langs.English, code))
    } else {
      return (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code)) +
        '(' + (<string>objectPath.get(langs.English, code)) + ')'
    }
  }

  help (code: string): string {
    return (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.name')) + '\n\n' +
      (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.description')) + '\n\n' +
      (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.how')).replace(/{botid}/g, '@' + config.bot.username) +
      ' ( ' + (<string>objectPath.get(langs.English, code + '.how')).replace(/{botid}/g, '@' + config.bot.username + ' )')
  }

  text (code: string): string {
    return (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code))
  }

  getLangList (): Langs {
    return langs
  }
}

import * as objectPath from 'object-path'
import * as language from 'languages'
import * as model from '../db'
import * as glob from 'glob-promise'
import * as path from 'path'
import { Logger } from 'log4js';
import { language as Language } from '../types'
import { config } from '../config';
import * as Telegram from 'node-telegram-bot-api'

const langs: Language.Langs = {}

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

  async set (msg: Telegram.Message | Telegram.InlineQuery | Telegram.CallbackQuery): Promise<void> {
    if (Object.keys(langs).length === 0) {
      this.logger.info('Language: Language not loaded')
      let items = await glob(path.join(__dirname, '..', '..', 'language', 'lang_*.json'))
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

    if ((<Telegram.Message>msg).chat) { // 일반 채팅 대응
      this.id = ((<Telegram.Message>msg).chat.type === 'private' ?
        (<Telegram.Message>msg).from!.id :
        (<Telegram.Message>msg).chat.id)
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = (<Telegram.Message>msg).from!.language_code!.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return
      }
    } else if ((<Telegram.CallbackQuery>msg).message) { // callback query 대응
      this.id = (<Telegram.CallbackQuery>msg).message!.chat.type === 'private' ?
        (<Telegram.CallbackQuery>msg).from.id :
        (<Telegram.CallbackQuery>msg).message!.chat.id
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = (<Telegram.CallbackQuery>msg).from!.language_code!.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return
      }
    } else if ((<Telegram.InlineQuery>msg).query) { // inline query 대응
      this.id = (<Telegram.InlineQuery>msg).from.id
      let query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = (<Telegram.InlineQuery>msg).from!.language_code!.split('-')[0]
        this.logger.debug(this.id + ' ' + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug('id: ' + this.id + ', lang: ' + this.lang)
        return
      }
    } else {
      throw Error('unknown message type')
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
      (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + '.how'))
        .replace(/{botid}/g, '@' + config.bot.username)
  }

  text (code: string): string {
    return (<string>objectPath.get(langs[language.getLanguageInfo(this.lang).name], code))
  }

  getLangList (): Language.Langs {
    return langs
  }
}

import * as glob from "glob-promise"
import * as language from "languages"
import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import * as objectPath from "object-path"
import * as path from "path"
import { config } from "../config"
import * as model from "../db"

interface ILangs {
  [index: string]: any
}

const langs: ILangs = {}

export default class Lang {
  public id: number
  public lang: string
  public logger: Logger
  public ready: boolean

  constructor(logger: Logger) {
    this.id = 0
    this.lang = ""
    this.logger = logger
    this.ready = false
  }

  public async set(msg: Telegram.Message | Telegram.InlineQuery | Telegram.CallbackQuery): Promise<void> {
    if (Object.keys(langs).length === 0) {
      this.logger.info("Language: Language not loaded")
      const items = await glob(path.join(__dirname, "..", "..", "language", "lang_*.json"))
      for (const i of items) {
        const temp = require(i)
        langs[temp.lang.langname] = temp
        this.logger.info('Language: "' + temp.lang.langname + '" Load complete')
      }
      this.logger.info("Language: Language load complete")
      this.ready = true
    } else {
      this.ready = true
    }

    if ((msg as Telegram.Message).chat) { // 일반 채팅 대응
      this.id = ((msg as Telegram.Message).chat.type === "private" ?
        (msg as Telegram.Message).from!.id :
        (msg as Telegram.Message).chat.id)
      const query = await model.language.find(this.id)
      model.user.update(this.id, (msg as Telegram.Message).chat.title!, (msg as Telegram.Message).chat.type)
      if (!query || !query.lang) {
        this.lang = this.getISOCode((msg as Telegram.Message).from!.language_code!)
        this.logger.debug(this.id + " " + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug("id: " + this.id + ", lang: " + this.lang)
        return
      }
    } else if ((msg as Telegram.CallbackQuery).message) { // callback query 대응
      this.id = (msg as Telegram.CallbackQuery).message!.chat.type === "private" ?
        (msg as Telegram.CallbackQuery).from.id :
        (msg as Telegram.CallbackQuery).message!.chat.id
      const query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = this.getISOCode((msg as Telegram.CallbackQuery).from!.language_code!)
        this.logger.debug(this.id + " " + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug("id: " + this.id + ", lang: " + this.lang)
        return
      }
    } else if ((msg as Telegram.InlineQuery).query) { // inline query 대응
      this.id = (msg as Telegram.InlineQuery).from.id
      const query = await model.language.find(this.id)
      if (!query || !query.lang) {
        this.lang = this.getISOCode((msg as Telegram.InlineQuery).from!.language_code!)
        this.logger.debug(this.id + " " + this.lang)
        model.language.create(this.id, this.lang)
        return
      } else {
        this.lang = query.lang
        this.logger.debug("id: " + this.id + ", lang: " + this.lang)
        return
      }
    } else {
      throw Error("unknown message type")
    }
  }

  public getLocale(): string {
    return this.lang
  }

  public async langset(lang: string): Promise<boolean> {
    let isExist = false
    for (const i in Object.keys(langs)) {
      if ((langs[Object.keys(langs)[i]].lang.code as string) === lang) {
        isExist = true
      }
    }
    if (isExist === false) {
      throw Error(lang + " is not a valid value")
    }
    try {
      await model.language.update(this.id, lang)
      this.lang = lang
      this.logger.debug({id: this.id, lang: this.lang})
      return true
    } catch (e) {
      throw (e)
    }
  }

  public inline(code: string): string {
    if (typeof this.lang === "undefined" || typeof langs[language.getLanguageInfo(this.lang).name] === "undefined") {
      return (objectPath.get(langs.Korean, code) as string)
        + "(" + (objectPath.get(langs.English, code) as string) + ")"
    } else if (language.getLanguageInfo(this.lang).name === "English") {
      return (objectPath.get(langs.English, code) as string)
    } else {
      return (objectPath.get(langs[language.getLanguageInfo(this.lang).name], code) as string) +
        "(" + (objectPath.get(langs.English, code) as string) + ")"
    }
  }

  public help(code: string): string {
    return (objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + ".name") as string) + "\n\n" +
      (objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + ".description") as string) + "\n\n" +
      (objectPath.get(langs[language.getLanguageInfo(this.lang).name], code + ".how") as string)
        .replace(/{botid}/g, "@" + config.bot.username)
  }

  public text(code: string): string {
    return (objectPath.get(langs[language.getLanguageInfo(this.lang).name], code) as string)
  }

  public getLangList(): ILangs {
    return langs
  }

  private getISOCode(originCode: string|null, defaultCode?: string) {
    if (originCode) {
      const code = originCode.match(/^([a-z]{2})/)

      if (code && code[1]) {
        return code[1]
      } else {
        return (defaultCode ? defaultCode : "en")
      }
    } else {
      return (defaultCode ? defaultCode : "en")
    }
  }
}

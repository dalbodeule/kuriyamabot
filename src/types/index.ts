import { User } from 'node-telegram-bot-api'

export interface globalType {
  config: configType,
  botinfo: User | null
}

export interface configType {
  dev: string | boolean,
  db: {
    database: string,
    username: string,
    password: string,
    host: string,
    type: string 
  },
  apiKey: {
    telegram: string
    whatanime: string
  }
}

export interface Langs {
  [index: string]: any
}

export interface Lang {
  set (msg: any): Promise<void>,
  langset (lang: string): Promise<boolean>,
  inline (code: string): string,
  help (code: string): string,
  text (code: string): string,
  getLangList (): Langs
}
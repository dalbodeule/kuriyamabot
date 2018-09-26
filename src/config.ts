import * as Telegram from 'node-telegram-bot-api'

export interface Config {
  readonly dev: string | boolean,
  readonly db: {
    readonly database: string,
    readonly username: string,
    readonly password: string,
    readonly host: string,
    readonly type: string
  },
  readonly apiKey: {
    readonly telegram: string,
    readonly whatanime: string
  }
  readonly bot: Telegram.User,
  readonly homepage: string
}

export const config: Config = {
  dev: process.env.dev || true,
  db: {
    database: process.env.database!,
    username: process.env.dbuser!,
    password: process.env.dbpw!,
    host: process.env.dbhost!,
    type: process.env.dbtype!
  },
  apiKey: {
    telegram: process.env.telegram!,
    whatanime: process.env.whatanime! 
  },
  bot: null as any as Telegram.User,
  homepage: 'https://moribot.mori.space/'
}

import * as Telegram from 'node-telegram-bot-api'

export interface Config {
  readonly dev: string | boolean,
  readonly db: {
    readonly database: string,
    readonly username: string,
    readonly password: string,
    readonly host: string,
    readonly port: number,
  },
  readonly redis: {
    readonly database: number,
    readonly password: string,
    readonly host: string,
    readonly port: number
  },
  readonly apiKey: {
    readonly telegram: string,
    readonly whatanime: string,
    readonly openweather: string,
    readonly kakao: string
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
    port: parseInt(process.env.dbport!) || 3306
  },
  redis: {
    database: parseInt(process.env.rdb!) || 0,
    password: process.env.rpw!,
    host: process.env.rhost!,
    port: parseInt(process.env.rport!) || 6379
  },
  apiKey: {
    telegram: process.env.telegram!,
    whatanime: process.env.whatanime!,
    openweather: process.env.openweather!,
    kakao: process.env.kakao!
  },
  bot: null as any as Telegram.User,
  homepage: 'https://moribot.mori.space/'
}

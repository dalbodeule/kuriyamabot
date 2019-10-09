import * as dotenv from "dotenv"
import * as Telegram from "node-telegram-bot-api"
import * as path from "path"

try {
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  })
} catch {
  // tslint:disable-next-line: no-console
  console.log("config can't load for .env file")
}

export interface Config {
  readonly dev: string | boolean
  readonly db: {
    readonly database: string,
    readonly username: string,
    readonly password: string,
    readonly host: string,
    readonly port: number
  }
  readonly redis: {
    readonly database: number,
    readonly password: string,
    readonly host: string,
    readonly port: number
  }
  readonly apiKey: {
    readonly telegram: string,
    readonly tracemoe: string,
    readonly openweather: string
  }
  readonly bot: Telegram.User
  readonly homepage: string
}

export const config: Config = {
  dev: process.env.dev || true,
  db: {
    database: process.env.database!,
    username: process.env.dbuser!,
    password: process.env.dbpw!,
    host: process.env.dbhost!,
    port: parseInt(process.env.dbport!, 10) || 3306,
  },
  redis: {
    database: parseInt(process.env.rdb!, 10) || 0,
    password: process.env.rpw!,
    host: process.env.rhost!,
    port: parseInt(process.env.rport!, 10) || 6379,
  },
  apiKey: {
    telegram: process.env.telegram!,
    tracemoe: process.env.tracemoe!,
    openweather: process.env.openweather!,
  },
  bot: null as any as Telegram.User,
  homepage: "https://kuriyama.mori.space/",
}

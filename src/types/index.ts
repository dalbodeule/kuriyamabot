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
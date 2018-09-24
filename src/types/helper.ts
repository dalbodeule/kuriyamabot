import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js'
import * as types from './index'
import * as google from 'google-parser'

export default interface helper {
  getuser (user: Telegram.User): string,
  getlang (msg: any, logger: Logger): Promise<types.language.Lang>
  commandlist (temp: types.language.Lang): any,
  langlist (temp: types.language.Lang): any,
  search (keyword: string): Promise<string | google.error | undefined>
  image (keyword: string): Promise<google.imgReturn | undefined>
}
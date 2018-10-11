import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js'
import * as types from './index'
import * as google from 'google-parser'
import * as modules from '../modules'

export default interface helper {
  commandList (temp: types.language.Lang): any
  getLang (msg: any, logger: Logger): Promise<types.language.Lang>
  getUser (user: Telegram.User): string,
  langList (temp: types.language.Lang): any,
  search: {
    search (keyword: string): Promise<string | google.error | undefined>
    image (keyword: string): Promise<google.imgReturn | undefined>
  },
  timeFormat: typeof modules.timeFormat
  weather: typeof modules.weather
}
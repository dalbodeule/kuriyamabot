import * as types from '../types'
import Lang from '../lang'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';

export default async (msg: Telegram.Message | Telegram.InlineQuery | Telegram.CallbackQuery, logger: Logger): Promise<types.language.Lang>  => {
  try {
    let temp = new Lang(logger)
    await temp.set(msg)
    return temp
  } catch (e) {
    throw (e)
  }
}
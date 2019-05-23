import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import Lang from "../lang"

export default async (msg: Telegram.Message | Telegram.InlineQuery | Telegram.CallbackQuery, logger: Logger): Promise<Lang>  => {
  try {
    const temp = new Lang(logger)
    await temp.set(msg)
    return temp
  } catch (e) {
    throw (e)
  }
}

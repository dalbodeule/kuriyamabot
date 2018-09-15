import { Logger } from "log4js";
import * as Telegram from 'node-telegram-bot-api'
import * as glob from 'glob-promise'
import * as path from 'path'

export default async (bot: Telegram, logger: Logger) => {
  try {
    let items = await glob(path.join(__dirname, './*_*.js'))

    for (let i in items) {
      require(items[i])(bot, logger)
    }
    logger.debug('Module: Load complete')
  } catch (e) {
    logger.error(e)
  }
}

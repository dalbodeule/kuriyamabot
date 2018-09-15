import * as Telegram from 'node-telegram-bot-api'
import * as log4js from 'log4js'
import { config as global, Config } from './config'
import * as modules from './modules'

const logger = log4js.getLogger()

try {
  if (global.dev === false) {
    logger.level = 'INFO'
    process.env.NODE_ENV = 'production'
  } else if (global.dev === true) {
    logger.level = 'DEBUG'
    process.env.NODE_ENV = 'development'
  } else {
    logger.level = 'ALL'
    process.env.NODE_ENV = 'development'
  }

  logger.info('Welcome to telegram bot!')
  logger.debug('Debug Mode!')

  const bot = new Telegram(global.apiKey.telegram, {polling: true})

  logger.info('Bot is activated!');

  (async () => {
    try {
      (global.bot as Partial<Config['bot']>)= await bot.getMe()

      const loadModules: {[index: string]: any} = {}

      for (let i in modules) {
        let LoadingModule = require(i)

        const LoadedModule = new LoadingModule(bot, logger)

        loadModules.i = LoadedModule
      }
      logger.info('Ready!')
    } catch (err) {
      logger.error(err)
      process.exit(0)
    }
  })()
} catch (err) {
  console.error(err)
}

import * as Telegram from 'node-telegram-bot-api'
import * as log4js from 'log4js'
import { config as global, Config } from './config'
import functions from './functions'
import * as functionBase from './functionBase';

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

  const bot = new Telegram(global.apiKey.telegram, {
    polling: true,
    filepath: false
  })

  logger.info('Bot is activated!');

  (async () => {
    try {
      (global.bot as Partial<Config['bot']>)= await bot.getMe()

      const loadfunctions: {
        [index: string]:
        functionBase.message |
        functionBase.inline |
        functionBase.command |
        functionBase.callback
      } = {}

      for(let key in functions) {
        loadfunctions[key] = new functions[key](bot, logger, global)
        loadfunctions[key].run()

        logger.debug(`module '${key}' successfuly load`)
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

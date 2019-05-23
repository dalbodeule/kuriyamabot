import * as Telegram from 'node-telegram-bot-api'
import * as log4js from 'log4js'
import { config, Config } from './config'
import operactors from './operactor'
import * as operactorBase from './operactorBase';

const logger = log4js.getLogger()

try {
  if (config.dev === false) {
    logger.level = 'INFO'
    process.env.NODE_ENV = 'production'
  } else {
    logger.level = 'DEBUG'
    process.env.NODE_ENV = 'development'
  }

  logger.info('Welcome to telegram bot!')
  logger.debug('Debug Mode!')

  const bot = new Telegram(config.apiKey.telegram, {
    polling: true,
    filepath: false
  })

  logger.info('Bot is activated!');

  (async () => {
    try {
      (config.bot as Partial<Config['bot']>)= await bot.getMe()

      for(let key in operactors) {
        let temp = new operactors[key](bot, logger, config)
        temp.run()

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

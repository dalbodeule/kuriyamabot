import * as Telegram from 'node-telegram-bot-api'
import * as log4js from 'log4js'
import global from './config'

const logger = log4js.getLogger()

try {
  if (global.config.dev === false) {
    logger.level = 'INFO'
    process.env.NODE_ENV = 'production'
  } else if (global.config.dev === true) {
    logger.level = 'DEBUG'
    process.env.NODE_ENV = 'development'
  } else {
    logger.level = 'ALL'
    process.env.NODE_ENV = 'development'
  }

  logger.info('Welcome to telegram bot!')
  logger.debug('Debug Mode!')

  const bot = new Telegram(global.config.apiKey.telegram, {polling: true})

  logger.info('Bot is activated!');

  (async () => {
    try {
      global.botinfo = await bot.getMe()
      require('./modules')(bot, logger)
      logger.info('Ready!')
    } catch (err) {
      logger.error(err)
      process.exit(0)
    }
  })()
} catch (err) {
  console.error(err)
}

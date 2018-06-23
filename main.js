'use strict'
const Telegram = require('node-telegram-bot-api')
const log4js = require('log4js')
const helper = require('./src/helper')
const logger = log4js.getLogger()

global.config = {
  apiKey: (process.env.apiKey || null),
  dev: (process.env.dev || true),
  db: {
    database: (process.env.database || null),
    username: (process.env.dbuser || null),
    password: (process.env.dbpw || null),
    host: (process.env.dbhost || null),
    type: (process.env.dbtype || null)
  },
  apikey: {
    whatanime: (process.env.whatanime || null)
  }
}

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

const bot = new Telegram(global.config.apiKey, {polling: true})

logger.info('Bot is activated!');

(async () => {
  try {
    global.botinfo = await bot.getMe()
    require('./src/modules')(bot, logger, helper)

    logger.info('Ready!')
  } catch (e) {
    logger.error(e)
    process.exit(0)
  }
})()

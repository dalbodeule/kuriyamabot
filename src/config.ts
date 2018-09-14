import * as type from './types'
import * as Telegram from 'node-telegram-bot-api'

const configClass = class ConfigClass {
  private _config: type.configType
  private _botinfo: Telegram.User | null

  constructor () {
    this._config = {
      dev: process.env.dev || true,
      db: {
        database: process.env.database || 'sometext',
        username: process.env.dbuser || 'sometext',
        password: process.env.dbpw || 'sometext',
        host: process.env.dbhost || 'sometext',
        type: process.env.dbtype || 'sometext'
      },
      apiKey: {
        telegram: process.env.telegram || 'sometext',
        whatanime: process.env.whatanime || 'sometext' 
      }
    },
    this._botinfo = null
  }

  get config (): type.configType {
    return this._config
  }
  set config ( config ) {
    this._config = config
  }

  get botinfo (): Telegram.User | null {
    return this._botinfo
  }
  set botinfo (user: Telegram.User | null) {
    this._botinfo = user
  }
}

export default new configClass()
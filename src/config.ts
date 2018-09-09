import * as type from './types'

const config: type.globalType = {
  config: {
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
  botinfo: null
}

export default config
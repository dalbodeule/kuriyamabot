import db from '../_db'

import * as language from './language'
import * as message from './message'

const defineTable = (tableConfig: { name: any, table: any, config: any }): any => {
  const { name, table, config } = tableConfig
  return db.define(name, table, config)
}

const tables = {
  Language: defineTable(language),
  Message: defineTable(message)
}

db.sync()

export default tables
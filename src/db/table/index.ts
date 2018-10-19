import mysql from '../_mysql'

import * as language from './language'
import * as message from './message'

const defineTable = (tableConfig: { name: any, table: any, config: any }): any => {
  const { name, table, config } = tableConfig
  return mysql.define(name, table, config)
}

const tables = {
  Language: defineTable(language),
  Message: defineTable(message)
}

mysql.sync()

export default tables
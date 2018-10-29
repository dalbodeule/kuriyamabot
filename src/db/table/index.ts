import mysql from '../_mysql'

import * as language from './language'
import * as leaveMessage from './leaveMessage'
import * as welcomeMessage from './welcomeMessage'
import * as user from './user'

const defineTable = (tableConfig: { name: any, table: any, config: any }): any => {
  const { name, table, config } = tableConfig
  return mysql.define(name, table, config)
}

const setFK = (origin: any, foreignKey:string, target: any, onUpdate:string, onDelete:string): void => {
  origin.hasMany(target, { foreignKey,
    onDelete: onDelete,
    onUpdate: onUpdate
  })
}

const tables = {
  User: defineTable(user),
  Language: defineTable(language),
  LeaveMessage: defineTable(leaveMessage),
  WelcomeMessage: defineTable(welcomeMessage)
}

setFK(tables.User, '_id', tables.Language,
  'cascade', 'cascade')
setFK(tables.User, '_id', tables.LeaveMessage,
  'cascade', 'cascade')
setFK(tables.User, '_id', tables.WelcomeMessage,
  'cascade', 'cascade')

mysql.sync()

export default tables
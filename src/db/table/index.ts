import mysql from '../_mysql'

import * as language from './language'
import * as leaveMessage from './leaveMessage'
import * as welcomeMessage from './welcomeMessage'
import * as user from './user'
import { Sequelize } from 'sequelize';

const defineTable = (tableConfig: { name: any, table: any, config: any }):
  Sequelize['Model'] => {
    const { name, table, config } = tableConfig
    return mysql.define(name, table, config)
  }

const tables = {
  User: defineTable(user),
  Language: defineTable(language),
  LeaveMessage: defineTable(leaveMessage),
  WelcomeMessage: defineTable(welcomeMessage)
}

tables.User.hasMany(tables.Language, {
  onDelete: 'cascade',
  onUpdate: 'cascade'
})
tables.User.hasMany(tables.LeaveMessage, {
  onDelete: 'cascade',
  onUpdate: 'cascade'
})
tables.User.hasMany(tables.WelcomeMessage, {
  onDelete: 'cascade',
  onUpdate: 'cascade'
})

tables.Language.belongsTo(tables.User)
tables.LeaveMessage.belongsTo(tables.User)
tables.WelcomeMessage.belongsTo(tables.User)

mysql.sync()

export default tables
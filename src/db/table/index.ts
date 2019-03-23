import mysql from '../_mysql'

import language from './language'
import leaveMessage from './leaveMessage'
import welcomeMessage from './welcomeMessage'
import user from './user'

const tables = {
  User: user,
  Language: language,
  LeaveMessage: leaveMessage,
  WelcomeMessage: welcomeMessage
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
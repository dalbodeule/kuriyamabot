import * as Sequelize from 'sequelize'
import global from '../config'

const db = new Sequelize(global.config.db.database,
  global.config.db.username,
  global.config.db.password,
  {
    host: global.config.db.host,
    dialect: global.config.db.type,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false,
    logging: false
  })

export default db

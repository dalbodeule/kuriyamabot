import * as Sequelize from 'sequelize'
import { config as global, config } from '../config'

const db = new Sequelize(global.db.database,
  global.db.username,
  global.db.password,
  {
    host: global.db.host,
    dialect: global.db.type,
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

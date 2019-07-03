import { Sequelize } from "sequelize"
import { config, config as global } from "../config"

const db = new Sequelize(global.db.database,
  global.db.username,
  global.db.password,
  {
    dialect: "mysql",
    host: global.db.host,
    logging: false,
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0,
    },
  })

export default db

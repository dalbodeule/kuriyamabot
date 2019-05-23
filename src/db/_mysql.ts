import { Sequelize } from "sequelize";
import { config, config as global } from "../config";

const db = new Sequelize(global.db.database,
  global.db.username,
  global.db.password,
  {
    host: global.db.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });

export default db;

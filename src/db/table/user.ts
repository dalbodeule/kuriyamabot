import * as Sequelize from "sequelize"
import sequelize from "../_mysql"

class User extends Sequelize.Model {}

User.init({
  id: {
    allowNull: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
    unique: true,
    validate: {
      isInt: true,
    },
  },
  title: {
    allowNull: true,
    type: Sequelize.STRING(40),
    unique: false,
  },
  type: {
    allowNull: true,
    type: Sequelize.STRING(10),
    unique: false,
  },
}, {
  sequelize,
  timestamps: false,
})

export default User

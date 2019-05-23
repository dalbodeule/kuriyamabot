import * as Sequelize from "sequelize";
import sequelize from "../_mysql";

class User extends Sequelize.Model {}

User.init({
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isInt: true,
    },
  },
  title: {
    type: Sequelize.STRING(40),
    allowNull: true,
    unique: false,
  },
  type: {
    type: Sequelize.STRING(10),
    allowNull: true,
    unique: false,
  },
}, {
  sequelize,
  timestamps: false,
});

export default User;

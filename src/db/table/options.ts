import * as Sequelize from "sequelize"
import sequelize from "../_mysql"

class Options extends Sequelize.Model {}

Options.init({
  optionName: {
    allowNull: false,
    type: Sequelize.STRING(2),
  },
  value: {
    allowNull: true,
    type: Sequelize.STRING(20),
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
})

export default Options

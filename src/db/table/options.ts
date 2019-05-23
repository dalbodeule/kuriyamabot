import * as Sequelize from "sequelize";
import sequelize from "../_mysql";

class Options extends Sequelize.Model {}

Options.init({
  optionName: {
    type: Sequelize.STRING(2), allowNull: false,
  },
  value: {
    type: Sequelize.STRING(20), allowNull: true,
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
});

export default Options;

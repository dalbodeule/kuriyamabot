import * as Sequelize from "sequelize";
import sequelize from "../_mysql";

class Language extends Sequelize.Model {}

Language.init({
  lang: {
    type: Sequelize.STRING(2), allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
});

export default Language;

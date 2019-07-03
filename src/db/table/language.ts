import * as Sequelize from "sequelize"
import sequelize from "../_mysql"

class Language extends Sequelize.Model {}

Language.init({
  lang: {
    allowNull: false,
    type: Sequelize.STRING(2),
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
})

export default Language

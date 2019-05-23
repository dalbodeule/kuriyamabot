import * as Sequelize from "sequelize"
import sequelize from "../_mysql"

class LeaveMessage extends Sequelize.Model {}

LeaveMessage.init({
  message: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false,
  },
  isEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: true,
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
})

export default LeaveMessage

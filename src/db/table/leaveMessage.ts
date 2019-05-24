import * as Sequelize from "sequelize"
import sequelize from "../_mysql"

class LeaveMessage extends Sequelize.Model {}

LeaveMessage.init({
  isEnabled: {
    allowNull: false,
    defaultValue: true,
    type: Sequelize.BOOLEAN,
    unique: false,
  },
  message: {
    allowNull: true,
    type: Sequelize.TEXT,
    unique: false,
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
})

export default LeaveMessage

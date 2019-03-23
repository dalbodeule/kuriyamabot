import * as Sequelize from 'sequelize'
import sequelize from '../_mysql'

class LeaveMessage extends Sequelize.Model{}

LeaveMessage.init({
  message: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false
    }
}, {
  sequelize,
  timestamps: false
})

export default LeaveMessage
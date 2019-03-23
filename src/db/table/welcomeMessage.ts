import * as Sequelize from 'sequelize'
import sequelize from '../_mysql'

class WelcomeMessage extends Sequelize.Model{}

WelcomeMessage.init({
  message: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false
  }
}, {
  sequelize,
  timestamps: false
})

export default WelcomeMessage
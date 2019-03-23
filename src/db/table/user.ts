import * as Sequelize from 'sequelize'
import sequelize from '../_mysql'

class User extends Sequelize.Model{}

User.init({
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isInt: true
    }
  }
}, {
  sequelize,
  timestamps: false
})

export default User

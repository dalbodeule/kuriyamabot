import * as Sequelize from 'sequelize'

export let name = 'user'

export let config = {
  timestamps: false
}

export let table = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isInt: true
    }
  }
}
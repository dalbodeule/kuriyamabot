import * as Sequelize from 'sequelize'

export let name = 'leaveMessage'

export let config = {
  timestamps: false
}

export let table = {
  message: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false
  }
}

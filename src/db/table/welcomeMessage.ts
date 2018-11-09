import * as Sequelize from 'sequelize'

export let name = 'welcomeMessage'

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

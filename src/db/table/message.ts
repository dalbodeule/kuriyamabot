import * as Sequelize from 'sequelize'

export let name = 'message'

export let config = {
  timestamps: false
}

export let table = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  welcomeMessage: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false
  },
  leaveMessage: {
    type: Sequelize.TEXT,
    allowNull: true,
    unique: false
  }
}

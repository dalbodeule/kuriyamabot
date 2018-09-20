import * as Sequelize from 'sequelize'

export let name = 'language'

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
  lang: {
    type: Sequelize.STRING, allowNull: false
  }
}
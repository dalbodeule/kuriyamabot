import * as Sequelize from 'sequelize'

export let name = 'language'

export let config = {
  timestamps: false
}

export let table = {
  lang: {
    type: Sequelize.STRING(2), allowNull: false
  }
}
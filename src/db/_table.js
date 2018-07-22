const Sequelize = require('sequelize')
const db = require('./_db')

const language = db.define('language', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isInt: true
    }
  },
  lang: {
    type: Sequelize.STRING, allowNull: false
  }
}, {
  timestamps: false
})

const message = db.define('message', {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      isInt: true
    }
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
}, {
  timestamps: false
})


module.exports.language = language
module.exports.message = message

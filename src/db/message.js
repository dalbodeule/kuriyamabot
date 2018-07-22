const db = require('./_table')
const SUCCESS = true

class Message {
  static async findLeave (id) {
    let result = await db.message.findOne({
      where: {
        id
      },
      attributes: ['id', 'leaveMessage'],
      raw: true
    })

    return result
  }

  static async createLeave (id, leaveMessage) {
    await db.message.create({
      id,
      leaveMessage
    })

    return SUCCESS
  }

  static async updateLeave (id, leaveMessage) {
    await db.message.update({
      leaveMessage
    }, {
      where: {
        id
      }
    })
  }

  static async findWelcome (id) {
    let result = await db.message.findOne({
      where: {
        id
      },
      attributes: ['id', 'welcomeMessage'],
      raw: true
    })

    return result
  }

  static async createWelcome (id, welcomeMessage) {
    await db.message.create({
      id,
      welcomeMessage
    })

    return SUCCESS
  }

  static async updateWelcome (id, welcomeMessage) {
    await db.message.update({
      welcomeMessage
    }, {
      where: {
        id
      }
    })
  }
}

module.exports = Message

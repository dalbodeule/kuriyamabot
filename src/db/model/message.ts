import db from '../table'
const SUCCESS = true

class Message {
  static async findLeave (id: number) {
    let result = await db.Message.findOne({
      where: {
        id
      },
      attributes: ['id', 'leaveMessage'],
      raw: true
    })

    return result
  }

  static async createLeave (id: number, leaveMessage: string) {
    await db.Message.create({
      id,
      leaveMessage
    })

    return SUCCESS
  }

  static async updateLeave (id: number, leaveMessage: string) {
    await db.Message.update({
      leaveMessage
    }, {
      where: {
        id
      }
    })
  }

  static async findWelcome (id: number) {
    let result = await db.Message.findOne({
      where: {
        id
      },
      attributes: ['id', 'welcomeMessage'],
      raw: true
    })

    return result
  }

  static async createWelcome (id: number, welcomeMessage: string) {
    await db.Message.create({
      id,
      welcomeMessage
    })

    return SUCCESS
  }

  static async updateWelcome (id: number, welcomeMessage: string) {
    await db.Message.update({
      welcomeMessage
    }, {
      where: {
        id
      }
    })
  }
}

export default Message

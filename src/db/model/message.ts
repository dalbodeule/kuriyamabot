import db from '../table'
import * as types from '../../types';
const SUCCESS = true

class Message {
  static async findLeave (id: number): Promise<types.i18n.returnLeaveMessage> {
    let result = await db.Message.findOne({
      where: {
        id
      },
      attributes: ['id', 'leaveMessage'],
      raw: true
    })

    return result
  }

  static async createLeave (id: number, leaveMessage: string): Promise<boolean> {
    await db.Message.create({
      id,
      leaveMessage
    })

    return SUCCESS
  }

  static async updateLeave (id: number, leaveMessage: string): Promise<boolean> {
    await db.Message.update({
      leaveMessage
    }, {
      where: {
        id
      }
    })

    return SUCCESS
  }

  static async findWelcome (id: number): Promise<types.i18n.returnWelcomeMessage> {
    let result = await db.Message.findOne({
      where: {
        id
      },
      attributes: ['id', 'welcomeMessage'],
      raw: true
    })

    return result
  }

  static async createWelcome (id: number, welcomeMessage: string): Promise<boolean> {
    await db.Message.create({
      id,
      welcomeMessage
    })

    return SUCCESS
  }

  static async updateWelcome (id: number, welcomeMessage: string): Promise<boolean> {
    await db.Message.update({
      welcomeMessage
    }, {
      where: {
        id
      }
    })

    return SUCCESS
  }
}

export default Message

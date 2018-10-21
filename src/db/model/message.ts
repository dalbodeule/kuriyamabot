import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const LEAVE_RPEFIX = 'leave:'
const WELCOME_PREFIX = 'welcome:'
const EXPIRE = 60*60*24

class Message {
  static async findLeave (id: number): Promise<types.i18n.returnLeaveMessage> {
    let query = await redis.getAsync(LEAVE_RPEFIX + id)

    if (query) {
      return {
        id,
        leaveMessage: query
      }
    } else {
      let result = await db.Message.findOne({
        where: {
          id
        },
        attributes: ['id', 'leaveMessage'],
        raw: true
      })

      if (result && result.leaveMessage) {
        redis.setAsync(LEAVE_RPEFIX + id, result.leaveMessage, 'EX', EXPIRE)
      }
      
      return result
    }
  }

  static async createLeave (id: number, leaveMessage: string): Promise<boolean> {
    await db.Message.create({
      id,
      leaveMessage
    })

    redis.setAsync(LEAVE_RPEFIX + id, leaveMessage, 'EX', EXPIRE)

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

    redis.setAsync(LEAVE_RPEFIX + id, leaveMessage, 'EX', EXPIRE)

    return SUCCESS
  }

  static async findWelcome (id: number): Promise<types.i18n.returnWelcomeMessage> {
    let query = await redis.getAsync(WELCOME_PREFIX + id)

    if (query) {
      return {
        id,
        welcomeMessage: query
      }
    } else {
      let result = await db.Message.findOne({
        where: {
          id
        },
        attributes: ['id', 'welcomeMessage'],
        raw: true
      })
      
      if (result && result.welcomeMessage) {
        redis.setAsync(WELCOME_PREFIX + id, result.welcomeMessage, 'EX', EXPIRE)
      }

      return result
    }
  }

  static async createWelcome (id: number, welcomeMessage: string): Promise<boolean> {
    await db.Message.create({
      id,
      welcomeMessage
    })

    redis.setAsync(WELCOME_PREFIX + id, welcomeMessage, 'EX', EXPIRE)

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

    redis.setAsync(WELCOME_PREFIX + id, welcomeMessage, 'EX', EXPIRE)

    return SUCCESS
  }

  static async deleteAll (id: number): Promise<boolean> {
    await db.Message.destroy({
      where: {
        id
      }
    })
    
    return SUCCESS
  }
}

export default Message

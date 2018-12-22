import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const PREFIX = 'leave:'
const EXPIRE = 60*60*24

class Message {
  static async find (id: number): Promise<types.model.returnLeaveMessage> {
    let query = await redis.getAsync(PREFIX + id)

    if (query) {
      return {
        id,
        message: query
      }
    } else {
      let result = await db.LeaveMessage.findOne({
        where: {
          userId: id
        },
        raw: true
      })

      if (result && result.mssage) {
        redis.setAsync(PREFIX + id, result.message, 'EX', EXPIRE)
      }
      
      return result
    }
  }

  static async create (id: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id
      }
    })

    await db.LeaveMessage.create({
      userId: id,
      message
    })

    redis.setAsync(PREFIX + id, message, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (id: number, message: string): Promise<boolean> {
    await db.LeaveMessage.update({
      message
    }, {
      where: {
        userId: id
      }
    })

    redis.setAsync(PREFIX + id, message, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Message

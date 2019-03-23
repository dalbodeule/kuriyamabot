import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const PREFIX = 'welcome:'
const EXPIRE = 60*60*24

class Message {
  static async find (id: number): Promise<types.model.returnWelcomeMessage | undefined> {
    let query = await redis.getAsync(PREFIX + id)

    if (query) {
      return {
        id,
        message: query
      }
    } else {
      let result = await db.WelcomeMessage.findOne({
        where: {
          id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLeaveMessage>result.toJSON())
        redis.setAsync(PREFIX + id, temp.message, 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async create (id: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id
      }
    })

    await db.WelcomeMessage.create({
      id,
      message
    })

    redis.setAsync(PREFIX + id, message, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (id: number, message: string): Promise<boolean> {
    await db.WelcomeMessage.update({
      message
    }, {
      where: {
        id
      }
    })

    redis.setAsync(PREFIX + id, message, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Message

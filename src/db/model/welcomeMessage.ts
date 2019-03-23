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
          user_id: id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLeaveMessage>result.toJSON())
        temp.id = (<any>temp).user_id
        redis.setAsync(PREFIX + id, temp.message, 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async create (id: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        user_id: id
      }
    })

    await db.WelcomeMessage.create({
      user_id: id,
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
        user_id: id
      }
    })

    redis.setAsync(PREFIX + id, message, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Message

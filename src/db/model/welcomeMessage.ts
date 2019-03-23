import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const PREFIX = 'welcome:'
const EXPIRE = 60*60*24

class Message {
  static async find (user_id: number): Promise<types.model.returnWelcomeMessage | undefined> {
    let query = await redis.getAsync(PREFIX + user_id)

    if (query) {
      return {
        user_id,
        message: query
      }
    } else {
      let result = await db.WelcomeMessage.findOne({
        where: {
          user_id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLeaveMessage>result.toJSON())
        redis.setAsync(PREFIX + user_id, temp.message, 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async create (user_id: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: user_id
      }
    })

    await db.WelcomeMessage.findOrCreate({
      where: {
        user_id
      },
      defaults: {
        message
      }
    })

    redis.setAsync(PREFIX + user_id, message, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (user_id: number, message: string): Promise<boolean> {
    await db.WelcomeMessage.update({
      message
    }, {
      where: {
        user_id
      }
    })

    redis.setAsync(PREFIX + user_id, message, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Message

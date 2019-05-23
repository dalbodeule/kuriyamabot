import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const PREFIX = 'leave:'
const EXPIRE = 60*60*24

class Message {
  static async find (user_id: number): Promise<types.model.returnLeaveMessage | undefined> {
    let query = await redis.getAsync(PREFIX + user_id)

    if (query) {
      let [message, isEnabled] = JSON.parse(query)
      
      return {
        user_id,
        message,
        isEnabled
      }
    } else {
      let result = await db.LeaveMessage.findOne({
        where: {
          user_id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLeaveMessage>result.toJSON())
        redis.setAsync(PREFIX + user_id, JSON.stringify([temp.message, temp.isEnabled]), 'EX', EXPIRE)
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

    await db.LeaveMessage.findOrCreate({
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

  static async update (user_id: number, message: string|null, isEnabled: boolean|null): Promise<boolean> {
    let updateData

    if ( message && isEnabled ) updateData = { message, isEnabled }
    else if ( message ) updateData = { message }
    else if ( isEnabled ) updateData = { isEnabled }
    else return false

    await db.LeaveMessage.update(updateData, {
      where: {
        user_id
      }
    })

    await this.find(user_id)

    return SUCCESS
  }
}

export default Message

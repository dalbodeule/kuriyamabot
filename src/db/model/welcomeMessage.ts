import * as types from "../../types"
import redis from "../_redis"
import db from "../table"

const SUCCESS = true
const PREFIX = "welcome:"
const EXPIRE = 60 * 60 * 24

class Message {
  public static async find(user_id: number): Promise<types.model.returnWelcomeMessage | undefined> {
    const query = await redis.getAsync(PREFIX + user_id)

    if (query) {
      const [message, isEnabled] = JSON.parse(query)

      return {
        user_id,
        message,
        isEnabled,
      }
    } else {
      const result = await db.WelcomeMessage.findOne({
        where: {
          user_id,
        },
      })

      let temp
      if (result) {
        temp = (result.toJSON() as types.model.returnLeaveMessage)
        redis.setAsync(PREFIX + user_id, JSON.stringify([temp.message, temp.isEnabled]), "EX", EXPIRE)
      }

      return temp
    }
  }

  public static async create(user_id: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: user_id,
      },
    })

    await db.WelcomeMessage.findOrCreate({
      where: {
        user_id,
      },
      defaults: {
        message,
      },
    })

    redis.setAsync(PREFIX + user_id, message, "EX", EXPIRE)

    return SUCCESS
  }

  public static async update(user_id: number, message: string|null, isEnabled: boolean|null): Promise<boolean> {
    let updateData

    if ( message && isEnabled ) { updateData = { message, isEnabled } } else if ( message ) { updateData = { message } } else if ( isEnabled ) { updateData = { isEnabled } } else { return false }

    await db.LeaveMessage.update(updateData, {
      where: {
        user_id,
      },
    })

    await this.find(user_id)

    return SUCCESS
  }
}

export default Message

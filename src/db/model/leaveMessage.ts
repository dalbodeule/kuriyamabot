import * as types from "../../types"
import redis from "../_redis"
import db from "../table"

const SUCCESS = true
const PREFIX = "leave:"
const EXPIRE = 60 * 60 * 24

class Message {
  public static async find(userId: number): Promise<types.model.IreturnLeaveMessage | undefined> {
    const query = await redis.getAsync(PREFIX + userId)

    if (query) {
      const [message, isEnabled] = JSON.parse(query)

      return {
        isEnabled,
        message,
        user_id: userId,
      }
    } else {
      const result = await db.LeaveMessage.findOne({
        where: {
          user_id: userId,
        },
      })

      let temp
      if (result) {
        temp = (result.toJSON() as types.model.IreturnLeaveMessage)
        redis.setAsync(PREFIX + userId, JSON.stringify([temp.message, temp.isEnabled]), "EX", EXPIRE)
      }

      return temp
    }
  }

  public static async create(userId: number, message: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: userId,
      },
    })

    await db.LeaveMessage.create({
      message,
      user_id: userId,
    })

    redis.setAsync(PREFIX + userId, message, "EX", EXPIRE)

    return SUCCESS
  }

  public static async update(userId: number, message: string|null, isEnabled: boolean|null): Promise<boolean> {
    let updateData

    if ( typeof message === "string" && typeof isEnabled === "boolean" ) {
      updateData = { message, isEnabled }
    } else if ( typeof message === "string" ) {
      updateData = { message }
    } else if ( typeof isEnabled === "boolean" ) {
      updateData = { isEnabled }
    } else {
      return false
    }

    await db.LeaveMessage.update(updateData, {
      where: {
        user_id: userId,
      },
    })

    await this.find(userId)

    return SUCCESS
  }
}

export default Message

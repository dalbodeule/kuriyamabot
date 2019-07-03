import * as types from "../../types"
import redis from "../_redis"
import db from "../table"

const SUCCESS = true
const PREFIX = "lang:"
const EXPIRE = 60 * 60 * 24

class Language {
  public static async find(userId: number): Promise<types.model.IreturnLanguage | undefined> {
    const query = await redis.getAsync(PREFIX + userId)

    if (query) {
      return {
        lang: query,
        user_id: userId,
      }
    } else {
      const result = await db.Language.findOne({
        where: {
          user_id: userId,
        },
      })

      let temp
      if (result) {
        temp = (result.toJSON() as types.model.IreturnLanguage)
        redis.setAsync(PREFIX + userId, temp.lang, "EX", EXPIRE)
      }

      return temp
    }
  }

  public static async create(userId: number, lang: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: userId,
      },
    })

    await db.Language.findOrCreate({
      defaults: {
        lang,
      },
      where: {
        user_id: userId,
      },
    })

    redis.setAsync(PREFIX + userId, lang, "EX", EXPIRE)

    return SUCCESS
  }

  public static async update(userId: number, lang: string): Promise<boolean> {
    await db.Language.update({
      lang,
    }, {
      where: {
        user_id: userId,
      },
    })

    redis.setAsync(PREFIX + userId, lang, "EX", EXPIRE)

    return SUCCESS
  }
}

export default Language

import * as types from "../../types"
import redis from "../_redis"
import db from "../table"

const SUCCESS = true
const PREFIX = "lang:"
const EXPIRE = 60 * 60 * 24

class Language {
  public static async find(user_id: number): Promise<types.model.returnLanguage | undefined> {
    const query = await redis.getAsync(PREFIX + user_id)

    if (query) {
      return {
        user_id,
        lang: query,
      }
    } else {
      const result = await db.Language.findOne({
        where: {
          user_id,
        },
      })

      let temp
      if (result) {
        temp = (result.toJSON() as types.model.returnLanguage)
        redis.setAsync(PREFIX + user_id, temp.lang, "EX", EXPIRE)
      }

      return temp
    }
  }

  public static async create(user_id: number, lang: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: user_id,
      },
    })

    await db.Language.findOrCreate({
      where: {
        user_id,
      },
      defaults: {
        lang,
      },
    })

    redis.setAsync(PREFIX + user_id, lang, "EX", EXPIRE)

    return SUCCESS
  }

  public static async update(user_id: number, lang: string): Promise<boolean> {
    await db.Language.update({
      lang,
    }, {
      where: {
        user_id,
      },
    })

    redis.setAsync(PREFIX + user_id, lang, "EX", EXPIRE)

    return SUCCESS
  }
}

export default Language

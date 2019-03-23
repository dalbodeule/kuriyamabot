import db from '../table'
import redis from '../_redis'
import * as types from '../../types'

const SUCCESS = true
const PREFIX = 'lang:'
const EXPIRE = 60*60*24

class Language {
  static async find (user_id: number): Promise<types.model.returnLanguage | undefined> {
    let query = await redis.getAsync(PREFIX + user_id)

    if (query) {
      return {
        user_id,
        lang: query
      }
    } else {
      let result = await db.Language.findOne({
        where: {
          user_id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLanguage>result.toJSON())
        redis.setAsync(PREFIX + user_id, temp.lang, 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async create (user_id: number, lang: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id: user_id
      }
    })

    await db.Language.create({
      user_id,
      lang
    })

    redis.setAsync(PREFIX + user_id, lang, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (user_id: number, lang: string): Promise<boolean> {
    await db.Language.update({
      lang
    }, {
      where: {
        user_id
      }
    })

    redis.setAsync(PREFIX + user_id, lang, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Language

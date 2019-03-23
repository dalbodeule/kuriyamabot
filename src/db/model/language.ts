import db from '../table'
import redis from '../_redis'
import * as types from '../../types'

const SUCCESS = true
const PREFIX = 'lang:'
const EXPIRE = 60*60*24

class Language {
  static async find (id: number): Promise<types.model.returnLanguage | undefined> {
    let query = await redis.getAsync(PREFIX + id)

    if (query) {
      return {
        id,
        lang: query
      }
    } else {
      let result = await db.Language.findOne({
        where: {
          userId: id
        }
      })

      let temp
      if (result) {
        temp = (<types.model.returnLanguage>result.toJSON())
        redis.setAsync(PREFIX + id, temp.lang, 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async create (id: number, lang: string): Promise<boolean> {
    await db.User.findOrCreate({
      where: {
        id
      }
    })

    db.Language.create({
      userId: id,
      lang
    })

    redis.setAsync(PREFIX + id, lang, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (lang: string, id: number): Promise<boolean> {
    await db.Language.update({
      lang
    }, {
      where: {
        userId: id
      }
    })

    redis.setAsync(PREFIX + id, lang, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Language

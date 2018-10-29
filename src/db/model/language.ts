import db from '../table'
import redis from '../_redis'
import * as types from '../../types'

const SUCCESS = true
const LANG_RPEFIX = 'lang:'
const EXPIRE = 60*60*24

class Language {
  static async find (id: number): Promise<types.model.returnLanguage> {
    let query = await redis.getAsync(LANG_RPEFIX + id)

    if (query) {
      return {
        id,
        lang: query
      }
    } else {
      let result = await db.Language.findOne({
        where: {
          _id: id
        },
        raw: true,
        attributes: [
          'id',
          'lang'
        ]
      })

      if (result && result.lang) {
        redis.setAsync(LANG_RPEFIX + id, result.lang, 'EX', EXPIRE)
      }
      
      return result
    }
  }

  static async create (id: number, lang: string): Promise<boolean> {
    db.Language.create({
      _id: id,
      lang
    })

    redis.setAsync(LANG_RPEFIX + id, lang, 'EX', EXPIRE)

    return SUCCESS
  }

  static async update (lang: string, id: number): Promise<boolean> {
    await db.Language.update({
      lang
    }, {
      where: {
        _id: id
      }
    })

    redis.setAsync(LANG_RPEFIX + id, lang, 'EX', EXPIRE)

    return SUCCESS
  }
}

export default Language

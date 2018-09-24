import db from '../table'
import * as types from '../../types'
const SUCCESS = true

class Language {
  static async find (id: number): Promise<types.i18n.returnLanguage> {
    let result = await db.Language.findOne({
      where: {
        id
      },
      raw: true,
      attributes: [
        'id',
        'lang'
      ]
    })

    return result
  }

  static async create (id: number, lang: string): Promise<boolean> {
    db.Language.create({
      id,
      lang
    })

    return SUCCESS
  }

  static async update (lang: string, id: number): Promise<boolean> {
    await db.Language.update({
      lang
    }, {
      where: {
        id
      }
    })

    return SUCCESS
  }
}

export default Language

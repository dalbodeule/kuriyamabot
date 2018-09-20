import db from '../table'
const SUCCESS = true

class Language {
  static async find (id: number): Promise<any> {
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

  static async create (id: number, lang: string) {
    db.Language.create({
      id,
      lang
    })

    return SUCCESS
  }

  static async update (lang: string, id: number) {
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

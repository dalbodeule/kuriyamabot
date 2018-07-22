const db = require('./_table')
const SUCCESS = true

class Language {
  static async find (id) {
    let result = await db.language.findOne({
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

  static async create (id, lang) {
    db.language.create({
      id,
      lang
    })

    return SUCCESS
  }

  static async update (lang, id) {
    await db.user.update({
      lang
    }, {
      where: {
        id
      }
    })

    return SUCCESS
  }
}

module.exports = Language

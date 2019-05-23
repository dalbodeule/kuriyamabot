import lang from '../lang'
import * as telegram from 'node-telegram-bot-api'

export default (temp: lang, userId: number): telegram.InlineKeyboardButton[][] => {
  let list: any = temp.getLangList()
  let listResult = []
  for (let i in Object.keys(list)) {
    listResult.push(list[Object.keys(list)[i]].lang)
  }
  let result: telegram.InlineKeyboardButton[][] = []
  for (let i = 0; i < listResult.length - 1; i += 2) {
    if (typeof listResult[i + 1] === 'object') {
      result.push([{
        text: listResult[i].display,
        callback_data: `changelang_${userId}_${listResult[i].code}`
      }, {
        text: listResult[i + 1].display,
        callback_data: `changelang_${userId}_${listResult[i + 1].code}`
      }])
    } else {
      result.push([{
        text: listResult[i].display,
        callback_data: `changelang_${userId}_${listResult[i].code}`
      }])
    }
  }
  return result
}
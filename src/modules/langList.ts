import * as telegram from "node-telegram-bot-api"
import lang from "../lang"

export default (temp: lang, userId: number): telegram.InlineKeyboardButton[][] => {
  const list: any = temp.getLangList()
  const listResult = []
  for (const i in Object.keys(list)) {
    listResult.push(list[Object.keys(list)[i]].lang)
  }
  const result: telegram.InlineKeyboardButton[][] = []
  for (let i = 0; i < listResult.length - 1; i += 2) {
    if (typeof listResult[i + 1] === "object") {
      result.push([{
        text: listResult[i].display,
        callback_data: `changelang_${userId}_${listResult[i].code}`,
      }, {
        text: listResult[i + 1].display,
        callback_data: `changelang_${userId}_${listResult[i + 1].code}`,
      }])
    } else {
      result.push([{
        text: listResult[i].display,
        callback_data: `changelang_${userId}_${listResult[i].code}`,
      }])
    }
  }
  return result
}

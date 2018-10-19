import lang from '../lang'

export default (temp: lang): any => {
  let list: any = temp.getLangList()
  let listResult = []
  for (let i in Object.keys(list)) {
    listResult.push(list[Object.keys(list)[i]].lang)
  }
  let result = []
  for (let i = 0; i < listResult.length - 1; i += 2) {
    if (typeof listResult[i + 1] === 'object') {
      result.push([{
        text: listResult[i].display,
        callback_data: 'changelang_' + listResult[i].code
      }, {
        text: listResult[i + 1].display,
        callback_data: 'changelang_' + listResult[i + 1].code
      }])
    } else {
      result.push([{
        text: listResult[i].display,
        callback_data: 'changelang_' + listResult[i].code
      }])
    }
  }
  return result
}
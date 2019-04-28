import * as google from 'google-parser'
export default class Search {
  static async search (keyword: string): Promise<string | google.error | undefined> {
    let res = await google.search(keyword + ' -site:ilbe.com')
    if ((<google.error>res).error) {
      return (<google.error>res)
    } else if (!res) {
      return undefined
    } else {
      let response = ''
      for (let i = 0; i < 3; i++) {
        if ((<Array<google.searchReturn>>res)[i]) {
          let tempDesc = (<Array<google.searchReturn>>res)[i].description
          if (tempDesc.length > 27) {
            tempDesc = tempDesc.substr(0, 30) + '...'
          }
          tempDesc.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
          response = response + '\n' + '<a href="' + (<Array<google.searchReturn>>res)[i].link + '">' +
            (<Array<google.searchReturn>>res)[i].title + '</a>' + '\n' +
            (!(<Array<google.searchReturn>>res)[i].description ? '' : tempDesc + '\n\n')
        }
      }
      return response
    }
  }
  static async image (keyword: string): Promise<google.imgReturn | undefined> {
    function getRandomIntInclusive (min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    let res = await google.img(keyword + ' -site:ilbe.com')

    let result: Array<google.imgReturn> = []
    res.forEach((value, index, array) => {
      if (value.img.match(/^(?:https?|data:image\/.*;base64)+.*/)) {
        result.push(value)
      }
    })

    if (typeof result[0] === 'undefined') {
      return undefined
    } else {
      let random = getRandomIntInclusive(0, (result.length < 20 ? result.length - 1 : 19))
      return {img: result[random].img, url: result[random].url}
    }
  }
}

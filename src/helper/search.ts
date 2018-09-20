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
    function removeMatching (originalArray: Array<google.imgReturn>, regex: RegExp) {
      let j = 0
      while (j < originalArray.length) {
        if (regex.test(originalArray[j].img)) {
          originalArray.splice(j, 1)
        } else {
          j++
        }
      }
      return originalArray
    }
    // https://stackoverflow.com/a/3661083

    let res = await google.img(keyword + ' -site:ilbe.com')

    res = removeMatching(res, /^x-raw-image:\/\/\/.*$/)

    if (typeof res[0] === 'undefined') {
      return undefined
    } else {
      let random = getRandomIntInclusive(0, (res.length < 20 ? res.length - 1 : 19))
      return {img: res[random].img, url: res[random].url}
    }
  }
}

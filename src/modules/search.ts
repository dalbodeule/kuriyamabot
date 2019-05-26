import * as google from "google-parser"
import { IImg } from "google-parser/dist/operactors/img"
import { ISearch, ISearchError } from "google-parser/dist/operactors/search"

const search = async (keyword: string): Promise<string | ISearchError | undefined> => {
  const res = await google.search(keyword + " -site:ilbe.com")
  if ((res as ISearchError).error) {
    return (res as ISearchError)
  } else if (!res) {
    return undefined
  } else {
    let response = ""
    for (let i = 0; i < 3; i++) {
      if ((res as ISearch[])[i]) {
        let tempDesc = (res as ISearch[])[i].description
        if (tempDesc.length > 27) {
          tempDesc = tempDesc.substr(0, 30) + "..."
        }
        tempDesc = tempDesc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "")
        response = response + "\n" + '<a href="' + (res as ISearch[])[i].url + '">' +
          (res as ISearch[])[i].title + "</a>" + "\n" +
          (!(res as ISearch[])[i].description ? "" : tempDesc + "\n\n")
      }
    }
    return response
  }
}

const image = async (keyword: string): Promise<IImg | undefined> => {
  function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const res = await google.img(keyword + " -site:ilbe.com")

  const result: IImg[] = []
  res.forEach((value, index, array) => {
    if (value.img.match(/^(?:https?|data:image\/.*;base64)+.*/)) {
      result.push(value)
    }
  })

  if (typeof result[0] === "undefined") {
    return undefined
  } else {
    const random = getRandomIntInclusive(0, (result.length < 20 ? result.length - 1 : 19))
    return {
      img: result[random].img,
      url: result[random].url,
      name: result[random].name,
    }
  }
}

export { search, image }

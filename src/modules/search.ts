import * as google from "google-parser"

const search = async (keyword: string): Promise<string | google.error | undefined> => {
  const res = await google.search(keyword + " -site:ilbe.com")
  if ((res as google.error).error) {
    return (res as google.error)
  } else if (!res) {
    return undefined
  } else {
    let response = ""
    for (let i = 0; i < 3; i++) {
      if ((res as google.searchReturn[])[i]) {
        let tempDesc = (res as google.searchReturn[])[i].description
        if (tempDesc.length > 27) {
          tempDesc = tempDesc.substr(0, 30) + "..."
        }
        tempDesc.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        response = response + "\n" + '<a href="' + (res as google.searchReturn[])[i].link + '">' +
          (res as google.searchReturn[])[i].title + "</a>" + "\n" +
          (!(res as google.searchReturn[])[i].description ? "" : tempDesc + "\n\n")
      }
    }
    return response
  }
}

const image = async (keyword: string): Promise<google.imgReturn | undefined> => {
  function getRandomIntInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const res = await google.img(keyword + " -site:ilbe.com")

  const result: google.imgReturn[] = []
  res.forEach((value, index, array) => {
    if (value.img.match(/^(?:https?|data:image\/.*;base64)+.*/)) {
      result.push(value)
    }
  })

  if (typeof result[0] === "undefined") {
    return undefined
  } else {
    const random = getRandomIntInclusive(0, (result.length < 20 ? result.length - 1 : 19))
    return {img: result[random].img, url: result[random].url}
  }
}

export { search, image }

import * as weatherHelper from "./weatherHelper"

export default class Weather {
  private OpenWeather: weatherHelper.weather.default
  private KakaoMap: weatherHelper.geocode.default

  private weatherKey: string
  private KakaoKey: string

  constructor(weatherKey: string, kakaoKey: string) {
    this.weatherKey = weatherKey
    this.KakaoKey = kakaoKey

    this.OpenWeather = new weatherHelper.weather.default(this.weatherKey, "metric", "en")
    this.KakaoMap = new weatherHelper.geocode.default(this.KakaoKey)
  }

  public async getWeatherWithCityName(cityName: string) {
    if (cityName.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
      return await this.getCityNameFromKakao(cityName)
    } else {
      return await this.getCityNameFromOpenWeatherMap(cityName)
    }
  }

  public async getWeatherWithGeograhic(latitude: number, longitude: number) {
    try {
      const weather = await this.OpenWeather.getByGeographic(latitude, longitude)
      if (weather.cod === 200) {
        return {
          humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
          icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
          success: true,
          temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
          windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
          windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
        }
      } else {
        return {
          apiError: true,
          success: false,
        }
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === "city not found") {
          return {
            notFound: true,
            success: false,
          }
      } else {
        return {
          apiError: true,
          success: false,
        }
      }
    }
  }

  private async getCityNameFromKakao(cityName: string) {
    try {
      const location = await this.KakaoMap.get(cityName)

      const resultLocation = location.documents![0]

      const lat = parseFloat(resultLocation.y)
      const lon = parseFloat(resultLocation.x)
      const displayLocation = resultLocation.address_name

      try {
        const weather = await this.OpenWeather.getByGeographic(lat, lon)
        if (weather.cod === 200) {
          return {
            displayLocation,
            humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
            icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
            success: true,
            temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
            windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
            windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
          }
        } else {
          return {
            apiError: true,
            geocodeError: false,
            success: false,
          }
        }
      } catch (e) {
        if (e.statusCode === 404 &&
          e.error.message === "city not found") {
            return {
              geocodeError: false,
              notFound: true,
              success: false,
            }
        } else {
          return {
            apiError: true,
            geocodeError: false,
            success: false,
          }
        }
      }
    } catch (e) {
      return {
        geocodeError: true,
        success: false,
      }
    }
  }

  private async getCityNameFromOpenWeatherMap(cityName: string) {
    try {
      const weather = await this.OpenWeather.getByCityName(cityName)
      if (weather.cod === 200) {
        const displayLocation =
          (weather as weatherHelper.weather.responseSuccess).name + "," +
          (weather as weatherHelper.weather.responseSuccess).sys.country

        return {
            displayLocation,
            humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
            icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
            success: true,
            temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
            windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
            windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
        }
      } else {
        return {
          apiError: true,
          geocodeError: false,
          success: false,
        }
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === "city not found") {
          return {
            geocodeError: false,
            notFound: true,
            success: false,
          }
      } else {
        return {
          apiError: true,
          geocodeError: false,
          success: false,
        }
      }
    }
  }
}

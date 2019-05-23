import * as weatherHelper from './weatherHelper'

export default class Weather {
  private OpenWeather: weatherHelper.weather.default
  private KakaoMap: weatherHelper.geocode.default

  private weatherKey: string
  private KakaoKey: string
  
  constructor (weatherKey: string, kakaoKey: string) {
    this.weatherKey = weatherKey
    this.KakaoKey = kakaoKey

    this.OpenWeather = new weatherHelper.weather.default(this.weatherKey, 'metric', 'en')
    this.KakaoMap = new weatherHelper.geocode.default(this.KakaoKey)
  }

  public async getWeatherWithCityName (cityName: string) {
    if (cityName.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
      return await this.getCityNameFromKakao(cityName)
    } else {
      return await this.getCityNameFromOpenWeatherMap(cityName)
    }
  }

  public async getWeatherWithGeograhic (latitude: number, longitude: number) {
    try {
      let weather = await this.OpenWeather.getByGeographic(latitude, longitude)
      if (weather.cod === 200) {
        return {
          success: true,
          windSpeed: (<weatherHelper.weather.responseSuccess>weather).wind.speed,
          windDeg: (<weatherHelper.weather.responseSuccess>weather).wind.deg.toFixed(2),
          humidity: (<weatherHelper.weather.responseSuccess>weather).main.humidity.toFixed(2),
          temp: (<weatherHelper.weather.responseSuccess>weather).main.temp,
          icon: (<weatherHelper.weather.responseSuccess>weather).weather[0].icon
        }
      } else {
        return {
          success: false,
          apiError: true
        }
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === 'city not found') {
          return {
            success: false,
            notFound: true
          }
      } else {
        return {
          success: false,
          apiError: true
        }
      }
    }
  }

  private async getCityNameFromKakao (cityName: string) {
    try {
      let location = await this.KakaoMap.get(cityName)
      
      let resultLocation = location.documents![0]

      let lat = parseFloat(resultLocation.y)
      let lon = parseFloat(resultLocation.x)
      let displayLocation = resultLocation.address_name

      try {
        let weather = await this.OpenWeather.getByGeographic(lat, lon)
        if (weather.cod === 200) {
          return {
            success: true,
            displayLocation,
            windSpeed: (<weatherHelper.weather.responseSuccess>weather).wind.speed,
            windDeg: (<weatherHelper.weather.responseSuccess>weather).wind.deg.toFixed(2),
            humidity: (<weatherHelper.weather.responseSuccess>weather).main.humidity.toFixed(2),
            temp: (<weatherHelper.weather.responseSuccess>weather).main.temp,
            icon: (<weatherHelper.weather.responseSuccess>weather).weather[0].icon
          }
        } else {
          return {
            success: false,
            apiError: true,
            geocodeError: false
          }
        }
      } catch (e) {
        if (e.statusCode === 404 &&
          e.error.message === 'city not found') {
            return {
              success: false,
              notFound: true,
              geocodeError: false
            }
        } else {
          return {
            success: false,
            apiError: true,
            geocodeError: false
          }
        }
      }
    } catch (e) {
      return {
        success: false,
        geocodeError: true
      }
    }
  }

  private async getCityNameFromOpenWeatherMap (cityName: string) {
    try {
      let weather = await this.OpenWeather.getByCityName(cityName)
      if (weather.cod === 200) {
        let displayLocation =
          (<weatherHelper.weather.responseSuccess>weather).name + ',' +
          (<weatherHelper.weather.responseSuccess>weather).sys.country
        
        return {
            success: true,
            displayLocation,
            windSpeed: (<weatherHelper.weather.responseSuccess>weather).wind.speed,
            windDeg: (<weatherHelper.weather.responseSuccess>weather).wind.deg.toFixed(2),
            humidity: (<weatherHelper.weather.responseSuccess>weather).main.humidity.toFixed(2),
            temp: (<weatherHelper.weather.responseSuccess>weather).main.temp,
            icon: (<weatherHelper.weather.responseSuccess>weather).weather[0].icon
        }
      } else {
        return {
          success: false,
          apiError: true,
          geocodeError: false
        }
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === 'city not found') {
          return {
            success: false,
            notFound: true,
            geocodeError: false
          }
      } else {
        return {
          success: false,
          apiError: true,
          geocodeError: false
        }
      }
    }
  }
}
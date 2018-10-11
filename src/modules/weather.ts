import * as helper from '../helper'

export default class Weather {
  private OpenWeather: helper.weather.default
  private KakaoMap: helper.geocode.default

  private weatherKey: string
  private KakaoKey: string
  
  constructor (weatherKey: string, kakaoKey: string) {
    this.weatherKey = weatherKey
    this.KakaoKey = kakaoKey

    this.OpenWeather = new helper.weather.default(this.weatherKey, 'metric', 'en')
    this.KakaoMap = new helper.geocode.default(this.KakaoKey)
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
          windSpeed: (<helper.weather.responseSuccess>weather).wind.speed,
          windDeg: (<helper.weather.responseSuccess>weather).wind.deg.toFixed(2),
          humidity: (<helper.weather.responseSuccess>weather).main.humidity.toFixed(2),
          temp: (<helper.weather.responseSuccess>weather).main.temp,
          icon: (<helper.weather.responseSuccess>weather).weather[0].icon
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
            windSpeed: (<helper.weather.responseSuccess>weather).wind.speed,
            windDeg: (<helper.weather.responseSuccess>weather).wind.deg.toFixed(2),
            humidity: (<helper.weather.responseSuccess>weather).main.humidity.toFixed(2),
            temp: (<helper.weather.responseSuccess>weather).main.temp,
            icon: (<helper.weather.responseSuccess>weather).weather[0].icon
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
          (<helper.weather.responseSuccess>weather).name + ',' +
          (<helper.weather.responseSuccess>weather).sys.country
        
        return {
            success: true,
            displayLocation,
            windSpeed: (<helper.weather.responseSuccess>weather).wind.speed,
            windDeg: (<helper.weather.responseSuccess>weather).wind.deg.toFixed(2),
            humidity: (<helper.weather.responseSuccess>weather).main.humidity.toFixed(2),
            temp: (<helper.weather.responseSuccess>weather).main.temp,
            icon: (<helper.weather.responseSuccess>weather).weather[0].icon
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
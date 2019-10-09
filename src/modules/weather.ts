import * as weatherHelper from "./weatherHelper"

export default class Weather {
  private OpenWeather: weatherHelper.default

  private weatherKey: string

  constructor(weatherKey: string) {
    this.weatherKey = weatherKey

    this.OpenWeather = new weatherHelper.default(this.weatherKey, "metric", "en")
  }

  public async getWeatherWithGeograhic(latitude: number, longitude: number) {
    try {
      const weather = await this.OpenWeather.getByGeographic(latitude, longitude)
      if (weather.cod === 200) {
        return {
          humidity: (weather as weatherHelper.IresponseSuccess).main.humidity.toFixed(2),
          icon: (weather as weatherHelper.IresponseSuccess).weather[0].icon,
          success: true,
          temp: (weather as weatherHelper.IresponseSuccess).main.temp,
          windDeg: (weather as weatherHelper.IresponseSuccess).wind.deg.toFixed(2),
          windSpeed: (weather as weatherHelper.IresponseSuccess).wind.speed,
        }
      } else {
        return {
          apiError: true,
          success: false,
        }
      }
    } catch (e) {
      return {
        apiError: true,
        success: false,
        message: e.error.message,
      }
    }
  }
}

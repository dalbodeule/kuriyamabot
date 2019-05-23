import * as weatherHelper from "./weatherHelper";

export default class Weather {
  private OpenWeather: weatherHelper.weather.default;
  private KakaoMap: weatherHelper.geocode.default;

  private weatherKey: string;
  private KakaoKey: string;

  constructor(weatherKey: string, kakaoKey: string) {
    this.weatherKey = weatherKey;
    this.KakaoKey = kakaoKey;

    this.OpenWeather = new weatherHelper.weather.default(this.weatherKey, "metric", "en");
    this.KakaoMap = new weatherHelper.geocode.default(this.KakaoKey);
  }

  public async getWeatherWithCityName(cityName: string) {
    if (cityName.match(/[ㄱ-ㅎ가-힣]+/) !== null) {
      return await this.getCityNameFromKakao(cityName);
    } else {
      return await this.getCityNameFromOpenWeatherMap(cityName);
    }
  }

  public async getWeatherWithGeograhic(latitude: number, longitude: number) {
    try {
      const weather = await this.OpenWeather.getByGeographic(latitude, longitude);
      if (weather.cod === 200) {
        return {
          success: true,
          windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
          windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
          humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
          temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
          icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
        };
      } else {
        return {
          success: false,
          apiError: true,
        };
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === "city not found") {
          return {
            success: false,
            notFound: true,
          };
      } else {
        return {
          success: false,
          apiError: true,
        };
      }
    }
  }

  private async getCityNameFromKakao(cityName: string) {
    try {
      const location = await this.KakaoMap.get(cityName);

      const resultLocation = location.documents![0];

      const lat = parseFloat(resultLocation.y);
      const lon = parseFloat(resultLocation.x);
      const displayLocation = resultLocation.address_name;

      try {
        const weather = await this.OpenWeather.getByGeographic(lat, lon);
        if (weather.cod === 200) {
          return {
            success: true,
            displayLocation,
            windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
            windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
            humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
            temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
            icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
          };
        } else {
          return {
            success: false,
            apiError: true,
            geocodeError: false,
          };
        }
      } catch (e) {
        if (e.statusCode === 404 &&
          e.error.message === "city not found") {
            return {
              success: false,
              notFound: true,
              geocodeError: false,
            };
        } else {
          return {
            success: false,
            apiError: true,
            geocodeError: false,
          };
        }
      }
    } catch (e) {
      return {
        success: false,
        geocodeError: true,
      };
    }
  }

  private async getCityNameFromOpenWeatherMap(cityName: string) {
    try {
      const weather = await this.OpenWeather.getByCityName(cityName);
      if (weather.cod === 200) {
        const displayLocation =
          (weather as weatherHelper.weather.responseSuccess).name + "," +
          (weather as weatherHelper.weather.responseSuccess).sys.country;

        return {
            success: true,
            displayLocation,
            windSpeed: (weather as weatherHelper.weather.responseSuccess).wind.speed,
            windDeg: (weather as weatherHelper.weather.responseSuccess).wind.deg.toFixed(2),
            humidity: (weather as weatherHelper.weather.responseSuccess).main.humidity.toFixed(2),
            temp: (weather as weatherHelper.weather.responseSuccess).main.temp,
            icon: (weather as weatherHelper.weather.responseSuccess).weather[0].icon,
        };
      } else {
        return {
          success: false,
          apiError: true,
          geocodeError: false,
        };
      }
    } catch (e) {
      if (e.statusCode === 404 &&
        e.error.message === "city not found") {
          return {
            success: false,
            notFound: true,
            geocodeError: false,
          };
      } else {
        return {
          success: false,
          apiError: true,
          geocodeError: false,
        };
      }
    }
  }
}

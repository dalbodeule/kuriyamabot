import * as request from "request-promise";

export default class OpenWeather {
  private key: string;
  private uri: string;
  private units: units;
  private locale: locale;

  constructor(key: string, units: units, locale: locale) {
    this.key = key;
    this.uri = "https://api.openweathermap.org/data/2.5/weather",
    this.units = units;
    this.locale = locale;
  }

  public setLocale(locale: locale): boolean {
    this.locale = locale;

    return true;
  }

  public getLocale(): string {
    return this.locale;
  }

  public async getByCityName(cityName: string, countryCode?: string):
    Promise<responseSuccess|responseError> {
    const options = {
      uri: this.uri,
      qs: {
        APPID: this.key,
        q: (countryCode ?
          `${cityName},${countryCode}` :
          cityName),
        units: this.units,
        lang: this.locale,
      },
      json: true,
    };
    const result = await request(options);
    return result;
  }

  public async getByGeographic(lat: number, lon: number):
    Promise<responseSuccess|responseError> {
      const options = {
        uri: this.uri,
        qs: {
          APPID: this.key,
          lat, lon,
          units: this.units,
          lang: this.locale,
        },
        json: true,
      };
      const result = await request(options);
      return result;
  }
}

export interface responseSuccess {
  coord: {
    lon: number,
    lat: number,
  };
  weather: [{
      id: number,
      main: string,
      description: string,
      icon: string,
    }];
  base: string;
  main: {
    temp: number,
    pressure: number,
    humidity: number,
    temp_min: number,
    temp_max: number,
    sea_level?: number,
    grnd_level?: number,
  };
  wind: {
    speed: number,
    deg: number,
  };
  clouds: {
    all: number,
  };
  rain: {
    "3h": number,
  };
  sys: {
    type: any,
    id: any,
    message: any,
    country: string,
    sunrise: number,
    sunset: number,
  };
  id: number;
  name: string;
  cod: any;
}

export interface responseError {
  cod: number;
  message: string;
}

export type locale = "ar" | "bg" | "ca" | "cz" | "de" | "el" |
  "en" | "fa" | "fi" | "fr" | "gl" | "hr" | "hu" | "it" | "ja" |
  "kr" | "la" | "lt" | "mk" | "nl" | "pl" | "pt" | "ro" | "ru" |
  "se" | "sk" | "sl" | "es" | "tr" | "ua" | "vi" |" zh_cn" | "zh_tw";

export type units = "imperial" | "metric" | null;

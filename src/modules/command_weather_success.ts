import { command as Command } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as WeatherAPI from '../helper/weather'

export default class CommandWeatherSuccess extends Command {
  private Weather: WeatherAPI.default
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)
    this.regexp = new RegExp('^/(?:weather|날씨)+(?:@' +
      this.config.bot.username + ')? (.+)$')

    this.Weather = new WeatherAPI.default(this.config.apiKey.openweather,
      'metric', 'en')
  }
  
  protected async module (msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id
      try {
        this.logger.info('command: weather, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getlang(msg, this.logger)
        ])

        try {
          let weather = await this.Weather.getByCityName(match[1])
          if (weather.cod === 200) {
            this.bot.sendMessage(chatid, '🗒 ' +
              temp.text('command.weather.message')
              .replace('{windSpeed}', '' +
                (<WeatherAPI.responseSuccess>weather).wind.speed)
              .replace('{windDeg}', '' + 
                ((<WeatherAPI.responseSuccess>weather).wind.deg) / 10)
              .replace('{tempMin}', '' +
                (<WeatherAPI.responseSuccess>weather).main.temp_min)
              .replace('{tempMax}', '' +
                (<WeatherAPI.responseSuccess>weather).main.temp_max)
              .replace('{tempCur}', '' +
                (<WeatherAPI.responseSuccess>weather).main.temp)
              .replace('{weather}', this.getWeatherIcon(
                (<WeatherAPI.responseSuccess>weather).weather[0].icon)
              ), {
                reply_to_message_id: msg.message_id
              })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: success')
          } else {
            this.bot.sendMessage(chatid, '❗️ ' +
            temp.text('command.weather.apierror'), {
              reply_to_message_id: msg.message_id
            })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: API Error')
          }
        } catch (e) {
          if (e.statusCode === 404 &&
            e.error.message === 'city not found') {
            this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.weather.not_found'), {
                reply_to_message_id: msg.message_id
              })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: not found')
          } else {
            this.bot.sendMessage(chatid, '❗️ ' +
            temp.text('command.weather.apierror'), {
              reply_to_message_id: msg.message_id
            })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: API Error')
              this.logger.debug(e.error)
          }
        }
      } catch (e) {
        this.logger.error('command: weather, chatid: ' + chatid +
          ', username: ' + this.helper.getuser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }

  getWeatherIcon(weatherDesc: string): string {
    let result = ''

    switch (weatherDesc) {
      case '01d':
      case '04d':
      case '04n':
        result = '☀️'
        break
      case '01n':
        result = '🌕'
        break
      case '02d':
      case '02n':
        result = '⛅️'
        break
      case '03d':
      case '03n':
        result = '☁️'
        break
      case '09d':
      case '09n':
        result = '🌧'
        break
      case '10d':
      case '10n':
        result = '🌦'
        break
      case '11d':
      case '11n':
        result = '⛈'
        break
      case '13d':
      case '13n':
        result = '🌨'
        break
      case '50d':
      case '50n':
        result = '🌫'
        break
    }

    return result
  }
}

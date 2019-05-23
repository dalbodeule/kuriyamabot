import { message as Message } from '../operactorBase'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import { Config } from '../config'
import * as modules from '../modules';

export default class MessageWeather extends Message {
  private Weather: modules.weather
  constructor (bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)

    this.Weather = new modules.weather(this.config.apiKey.openweather, this.config.apiKey.kakao)
  }

  protected async module (msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) return
    const chatid = msg.chat.id

    if (msg.location) {
      try {
        this.logger.info('message: weather, chatid: ' + chatid + 
          ', userid: ' + msg.from!.id + ', status: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getLang(msg, this.logger)
        ])

        try {
          let weather = await this.Weather.getWeatherWithGeograhic(
            msg.location.latitude, msg.location.longitude)
          if (weather.success) {
            await this.bot.sendMessage(chatid, '🗒 ' +
              temp.text('command.weather.message.map')
              .replace('{windSpeed}', '' + weather.windSpeed!)
              .replace('{windDeg}', '' + weather.windDeg!)
              .replace('{humidity}', '' + weather.humidity!)
              .replace('{tempCur}', '' + weather.temp!)
              .replace('{weather}', this.getWeatherIcon(weather.icon!)), {
                reply_to_message_id: msg.message_id,
                parse_mode: "Markdown"
              })
            this.logger.info('message: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: success')
          } else if (!weather.success && weather.apiError) {
            this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.weather.apierror'), {
                reply_to_message_id: msg.message_id
            })
            this.logger.info('message: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: API Error')
          } else if (!weather.success && weather.notFound) {
            this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.weather.not_found'), {
                reply_to_message_id: msg.message_id
              })
            this.logger.info('message: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: not found')
          }
        } catch (e) {
          this.logger.error('message: weather, chatid: ' + chatid +
            ', userid: ' + msg.from!.id + ', status: error')
          this.logger.debug(e.stack)
        }
      } catch (e) {
        this.logger.error('message: weather, chatid: ' + chatid +
          ', userid: ' + msg.from!.id + ', status: error')
        this.logger.debug(e.stack)
      }
    } else if (msg.reply_to_message && msg.reply_to_message.text &&
      msg.reply_to_message.text.match(/☀️❗️/)) {
      try {
        this.logger.info('command: weather, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: pending')

        let [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, 'typing'),
          this.helper.getLang(msg, this.logger)
        ])
        
        try {
          let weather = await this.Weather.getWeatherWithCityName(msg.text!)
          if (weather.success) {
            await this.bot.sendMessage(chatid, '🗒 ' +
              temp.text('command.weather.message.command')
              .replace('{location}', weather.displayLocation!)
              .replace('{windSpeed}', '' + weather.windSpeed!)
              .replace('{windDeg}', '' + weather.windDeg!)
              .replace('{humidity}', '' + weather.humidity!)
              .replace('{tempCur}', '' + weather.temp!)
              .replace('{weather}', this.getWeatherIcon(weather.icon!)), {
                reply_to_message_id: msg.message_id,
                parse_mode: "Markdown"
              })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: success')
          } else if (!weather.success && weather.apiError) {
            this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.weather.apierror'), {
                reply_to_message_id: msg.message_id
            })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: API Error')
          } else if (!weather.success && weather.notFound) {
            this.bot.sendMessage(chatid, '❗️ ' +
              temp.text('command.weather.not_found'), {
                reply_to_message_id: msg.message_id
              })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: not found')
          } else if (!weather.success && weather.geocodeError) {
            this.bot.sendMessage(chatid, '❗️ ' +
            temp.text('command.weather.geocode_error'), {
              reply_to_message_id: msg.message_id
            })
            this.logger.info('command: weather, chatid: ' + chatid + 
              ', userid: ' + msg.from!.id + ', status: Geocode Error')
          }
        } catch (e) {
          this.logger.error('command: weather, chatid: ' + chatid +
            ', username: ' + this.helper.getUser(msg.from!) +
            ', command: ' + msg.text + ', type: error')
          this.logger.debug(e.stack)
        }
      } catch (e) {
        this.logger.error('command: weather, chatid: ' + chatid +
          ', username: ' + this.helper.getUser(msg.from!) +
          ', command: ' + msg.text + ', type: error')
        this.logger.debug(e.stack)
      }
    } else {
      return
    }
  }

  getWeatherIcon(weatherDesc: string): string {
    let result = ''

    switch (weatherDesc) {
      case '01d':
      case '04d':
        result = '☀️'
        break
      case '01n':
      case '04n':
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

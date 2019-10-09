import { Logger } from "log4js"
import * as Telegram from "node-telegram-bot-api"
import { Config } from "../config"
import * as modules from "../modules"
import { message as Message } from "../operactorBase"

export default class MessageWeather extends Message {
  private Weather: modules.weather
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config)

    this.Weather = new modules.weather(this.config.apiKey.openweather)
  }

  public getWeatherIcon(weatherDesc: string): string {
    let result = ""

    switch (weatherDesc) {
      case "01d":
      case "04d":
        result = "☀️"
        break
      case "01n":
      case "04n":
        result = "🌕"
        break
      case "02d":
      case "02n":
        result = "⛅️"
        break
      case "03d":
      case "03n":
        result = "☁️"
        break
      case "09d":
      case "09n":
        result = "🌧"
        break
      case "10d":
      case "10n":
        result = "🌦"
        break
      case "11d":
      case "11n":
        result = "⛈"
        break
      case "13d":
      case "13n":
        result = "🌨"
        break
      case "50d":
      case "50n":
        result = "🌫"
        break
    }

    return result
  }

  protected async module(msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) { return }
    const chatid = msg.chat.id

    if (msg.location) {
      try {
        this.logger.info("message: weather, chatid: " + chatid +
          ", userid: " + msg.from!.id + ", status: pending")

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ])

        try {
          const weather = await this.Weather.getWeatherWithGeograhic(
            msg.location.latitude, msg.location.longitude)
          if (weather.success) {
            await this.bot.sendMessage(chatid, "🗒 " +
              temp.text("command.weather.message.map")
              .replace("{windSpeed}", "" + weather.windSpeed!)
              .replace("{windDeg}", "" + weather.windDeg!)
              .replace("{humidity}", "" + weather.humidity!)
              .replace("{tempCur}", "" + weather.temp!)
              .replace("{weather}", this.getWeatherIcon(weather.icon!)), {
                reply_to_message_id: msg.message_id,
                parse_mode: "Markdown",
              })
            this.logger.info("message: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: success")
          } else {
            this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.weather.apierror") + "\n\n" + weather.message, {
                reply_to_message_id: msg.message_id,
            })
            this.logger.info("message: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: API Error")
          }
        } catch (e) {
          this.logger.error("message: weather, chatid: " + chatid +
            ", userid: " + msg.from!.id + ", status: error")
          this.logger.debug(e.stack)
        }
      } catch (e) {
        this.logger.error("message: weather, chatid: " + chatid +
          ", userid: " + msg.from!.id + ", status: error")
        this.logger.debug(e.stack)
      }
    }
  }
}

import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import * as modules from "../modules";
import { command as Command } from "../operactorBase";

export default class CommandWeatherSuccess extends Command {
  private Weather: modules.weather;
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
    this.regexp = new RegExp("^/(?:weather|날씨)+(?:@" +
      this.config.bot.username + ")? (.+)$");

    this.Weather = new modules.weather(this.config.apiKey.openweather, this.config.apiKey.kakao);
  }

  protected async module(msg: Telegram.Message, match: RegExpExecArray) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date <= 180) {
      const chatid = msg.chat.id;
      try {
        this.logger.info("command: weather, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: pending");

        const [send, temp] = await Promise.all([
          this.bot.sendChatAction(chatid, "typing"),
          this.helper.getLang(msg, this.logger),
        ]);

        try {
          const weather = await this.Weather.getWeatherWithCityName(match[1]);
          if (weather.success) {
            await this.bot.sendMessage(chatid, "🗒 " +
              temp.text("command.weather.message.command")
              .replace("{location}", weather.displayLocation!)
              .replace("{windSpeed}", "" + weather.windSpeed!)
              .replace("{windDeg}", "" + weather.windDeg!)
              .replace("{humidity}", "" + weather.humidity!)
              .replace("{tempCur}", "" + weather.temp!)
              .replace("{weather}", this.getWeatherIcon(weather.icon!)), {
                reply_to_message_id: msg.message_id,
                parse_mode: "Markdown",
              });
            this.logger.info("command: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: success");
          } else if (!weather.success && weather.apiError) {
            this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.weather.apierror"), {
                reply_to_message_id: msg.message_id,
            });
            this.logger.info("command: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: API Error");
          } else if (!weather.success && weather.notFound) {
            this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.weather.not_found"), {
                reply_to_message_id: msg.message_id,
              });
            this.logger.info("command: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: not found");
          } else if (!weather.success && weather.geocodeError) {
            this.bot.sendMessage(chatid, "❗️ " +
            temp.text("command.weather.geocode_error"), {
              reply_to_message_id: msg.message_id,
            });
            this.logger.info("command: weather, chatid: " + chatid +
              ", userid: " + msg.from!.id + ", status: Geocode Error");
          }
        } catch (e) {
          this.logger.error("command: weather, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: error");
          this.logger.debug(e.stack);
        }
      } catch (e) {
        this.logger.error("command: weather, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: error");
        this.logger.debug(e.stack);
      }
    }
  }

  private getWeatherIcon(weatherDesc: string): string {
    let result = "";

    switch (weatherDesc) {
      case "01d":
      case "04d":
        result = "☀️";
        break;
      case "01n":
      case "04n":
        result = "🌕";
        break;
      case "02d":
      case "02n":
        result = "⛅️";
        break;
      case "03d":
      case "03n":
        result = "☁️";
        break;
      case "09d":
      case "09n":
        result = "🌧";
        break;
      case "10d":
      case "10n":
        result = "🌦";
        break;
      case "11d":
      case "11n":
        result = "⛈";
        break;
      case "13d":
      case "13n":
        result = "🌨";
        break;
      case "50d":
      case "50n":
        result = "🌫";
        break;
    }

    return result;
  }
}

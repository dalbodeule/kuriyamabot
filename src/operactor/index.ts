// modules

// callback
import callbackChangeLang from "./callback_changeLang"

// command

import chatImage from "./chat_image"
import chatSearch from "./chat_search"
import commandCalcError from "./command_calc_error"
import commandCalcSuccess from "./command_calc_success"
import commandHelp from "./command_help"
import commandHomepage from "./command_homepage"
import commandImageError from "./command_image_error"
import commandImageSuccess from "./command_image_success"
import commandLang from "./command_lang"
import commandLeaveError from "./command_leave_error"
import commandLeaveSuccess from "./command_leave_success"
import commandMe from "./command_me"
import commandMsginfo from "./command_msginfo"
import commandSearchError from "./command_search_error"
import commandSearchSuccess from "./command_search_success"
import commandStart from "./command_start"
import commandTranslateError from "./command_translate_error"
import commandTranslateSuccess from "./command_translate_success"
import commandUptime from "./command_uptime"
import commandWeatherError from "./command_weather_error"
import commandWeatherSuccess from "./command_weather_success"
import commandWelcomeError from "./command_welcome_error"
import commandWelcomeSuccess from "./command_welcome_success"
import commandWhatanime from "./command_whatanime"

// inline

import inlineHelp from "./inline_help"
import inlineImage from "./inline_image"
import inlineSearch from "./inline_search"
import inlineYoutube from "./inline_youtube"

// message

import messageCalc from "./message_calc"
import messageJoin from "./message_join"
import messageLeft from "./message_left"
import messageLogger from "./message_logger"
import messageSearch from "./message_search"
import messageTranslate from "./message_translate"
import messageWeather from "./message_weather"
import messageWhatanime from "./message_whatanime"
import messageImage from "./messgae_image"

// modules end

const modules: {
  [index: string]: any
} = {
  callbackChangeLang,

  chatImage,
  chatSearch,
  commandCalcSuccess,
  commandCalcError,
  commandHelp,
  commandHomepage,
  commandImageSuccess,
  commandImageError,
  commandLang,
  commandLeaveSuccess,
  commandLeaveError,
  commandMe,
  commandMsginfo,
  commandSearchSuccess,
  commandSearchError,
  commandStart,
  commandTranslateSuccess,
  commandTranslateError,
  commandUptime,
  commandWeatherSuccess,
  commandWeatherError,
  commandWelcomeSuccess,
  commandWelcomeError,
  commandWhatanime,

  inlineHelp,
  inlineImage,
  inlineSearch,
  inlineYoutube,

  messageCalc,
  messageJoin,
  messageLeft,
  messageLogger,
  messageSearch,
  messageTranslate,
  messageWeather,
  messageWhatanime,
  messageImage,
}

export default modules

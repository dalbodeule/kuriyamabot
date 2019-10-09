// modules

// callback
import callbackChangeLang from "./callback_changeLang"

// command

import chatImage from "./chat_image"
import chatSearch from "./chat_search"
import commandCalcArgsNull from "./command_calc_args_null"
import commandCalcArgsSet from "./command_calc_args_set"
import commandHelp from "./command_help"
import commandHomepage from "./command_homepage"
import commandImageArgsNull from "./command_image_args_null"
import commandImageArgsSet from "./command_image_args_set"
import commandLang from "./command_lang"
import commandLeaveError from "./command_leave_args_null"
import commandLeaveSuccess from "./command_leave_args_set"
import commandMe from "./command_me"
import commandMsginfo from "./command_msginfo"
import commandSearchArgsNull from "./command_search_args_null"
import commandSearchArgsSet from "./command_search_args_set"
import commandStart from "./command_start"
import commandTranslateArgsNull from "./command_translate_args_null"
import commandTranslateArgsSet from "./command_translate_args_set"
import commandUptime from "./command_uptime"
import commandWeather from "./command_weather"
import commandWelcomeArgsNull from "./command_welcome_args_null"
import commandWelcomeArgsSet from "./command_welcome_args_set"
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
  commandCalcArgsNull,
  commandCalcArgsSet,
  commandHelp,
  commandHomepage,
  commandImageArgsNull,
  commandImageArgsSet,
  commandLang,
  commandLeaveSuccess,
  commandLeaveError,
  commandMe,
  commandMsginfo,
  commandSearchArgsNull,
  commandSearchArgsSet,
  commandStart,
  commandTranslateArgsNull,
  commandTranslateArgsSet,
  commandUptime,
  commandWeather,
  commandWelcomeArgsNull,
  commandWelcomeArgsSet,
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

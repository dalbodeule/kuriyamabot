// modules

// callback
import callbackChangeLang from './callback_changeLang'
import callbackHelpCalc from './callback_help_calc'
import callbackHelpHelp from './callback_help_help'
import callbackHelpHomepage from './callback_help_homepage'
import callbackHelpImg from './callback_help_img'
import callbackHelpLang from './callback_help_lang'
import callbackHelpLeave from './callback_help_leave'
import callbackHelpMe from './callback_help_me'
import callbackHelpMsginfo from './callback_help_msginfo'
import callbcakHelpSearch from './callback_help_search'
import callbackHelpStart from './callback_help_start'
import callbackHelpUptime from './callback_help_uptime'
import callbackHelpWeather from './callback_help_weather'
import callbackHelpWelcome from './callback_help_welcome'
import callbackHelpWhatanime from './callback_help_whatanime'

// command

import chatImage from './chat_image'
import chatSearch from './chat_search'
import commandCalcSuccess from './command_calc_success'
import commandCalcError from './command_calc_error'
import commandHelp from './command_help'
import commandHomepage from './command_homepage'
import commandImageSuccess from './command_image_success'
import commandImageError from './command_image_error'
import commandLang from './command_lang'
import commandLeaveSuccess from './command_leave_success'
import commandLeaveError from './command_leave_error'
import commandMe from './command_me'
import commandMsginfo from './command_msginfo'
import commandSearchSuccess from './command_search_success'
import commandSearchError from './command_search_error'
import commandStart from './command_start'
import commandTranslateSuccess from './command_translate_success'
import commandTranslateError from './command_translate_error'
import commandUptime from './command_uptime'
import commandWeatherSuccess from './command_weather_success'
import commandWeatherError from './command_weather_error'
import commandWelcomeSuccess from './command_welcome_success'
import commandWelcomeError from './command_welcome_error'
import commandWhatanime from './command_whatanime'

// inline

import inlineHelp from './inline_help'
import inlineImage from './inline_image'
import inlineSearch from './inline_search'
import inlineYoutube from './inline_youtube'

// message

import messageCalc from './message_calc'
import messageJoin from './message_join'
import messageLeft from './message_left'
import messageLogger from './message_logger'
import messageSearch from './message_search'
import messageTranslate from './message_translate'
import messageWeather from './message_weather'
import messageWhatanime from './message_whatanime'
import messageImage from './messgae_image'

// modules end

const modules: {
  [index: string]: any
} = {
  callbackChangeLang,
  callbackHelpCalc,
  callbackHelpHelp,
  callbackHelpHomepage,
  callbackHelpImg,
  callbackHelpLang,
  callbackHelpLeave,
  callbackHelpMe,
  callbackHelpMsginfo,
  callbcakHelpSearch,
  callbackHelpStart,
  callbackHelpUptime,
  callbackHelpWeather,
  callbackHelpWelcome,
  callbackHelpWhatanime,

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
  messageImage
}

export default modules

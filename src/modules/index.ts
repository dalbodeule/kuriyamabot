// modules

// callback
import callbackChangeLang from './callback_changeLang'
import callbackHelpHelp from './callback_help_help'
import callbackHelpHomepage from './callback_help_homepage'
import callbackHelpImage from './callback_help_image'
import callbackHelpLang from './callback_help_lang'
import callbackHelpLeave from './callback_help_leave'
import callbackHelpMe from './callback_help_me'
import callbackHelpMsginfo from './callback_help_msginfo'
import callbcakHelpSearch from './callback_help_search'
import callbackHelpStart from './callback_help_start'
import callbackHelpUptime from './callback_help_uptime'
import callbackHelpWelcome from './callback_help_welcome'
import callbackHelpWhatanime from './callback_help_whatanime'

// command

import chatImage from './chat_image'
import chatSearch from './chat_search'
import commandHelp from './command_help'
import commandHomepage from './command_homepage'
import commandImageSuccess from './command_image_success'
import commandImageError from './command_image_error'
import commandLang from './command_lang'
import commandLeaveSuccess from './command_leave_success'
import commandLeaveError from './command_leave_error'
import commandMe from './command_me'
import commandMsginfo from './command_msginfo'
import commandNigai from './command_nigai'
import commandSearchSuccess from './command_search_success'
import commandSearchError from './command_search_error'
import commandStart from './command_start'
import commandUptime from './command_uptime'
import commandWelcomeSuccess from './command_welcome_success'
import commandWelcomeError from './command_welcome_error'
import commandWhatanime from './command_whatanime'

// inline

import inlineHelp from './inline_help'
import inlineImage from './inline_image'
import inlineSearch from './inline_search'
import inlineYoutube from './inline_youtube'

// message

import messageJoin from './message_join'
import messageLeft from './message_left'
import messageLogger from './message_logger'
import messageSearch from './message_search'
import messageWhatanime from './message_whatanime'
import messageImage from './messgae_image'

// modules end

const modules: {
  [index: string]: any
} = {
  callbackChangeLang,
  callbackHelpHelp,
  callbackHelpHomepage,
  callbackHelpImage,
  callbackHelpLang,
  callbackHelpLeave,
  callbackHelpMe,
  callbackHelpMsginfo,
  callbcakHelpSearch,
  callbackHelpStart,
  callbackHelpUptime,
  callbackHelpWelcome,
  callbackHelpWhatanime,
  chatImage,
  chatSearch,
  commandHelp,
  commandHomepage,
  commandImageSuccess,
  commandImageError,
  commandLang,
  commandLeaveSuccess,
  commandLeaveError,
  commandMe,
  commandMsginfo,
  commandNigai,
  commandSearchSuccess,
  commandSearchError,
  commandStart,
  commandUptime,
  commandWelcomeSuccess,
  commandWelcomeError,
  commandWhatanime,
  inlineHelp,
  inlineImage,
  inlineSearch,
  inlineYoutube,
  messageJoin,
  messageLeft,
  messageLogger,
  messageSearch,
  messageWhatanime,
  messageImage
}

export default modules

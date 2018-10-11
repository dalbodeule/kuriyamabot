import * as types from '../types'

export default (temp: types.language.Lang): any => {
  return [
    [{
      text: '📒 ' + temp.inline('command.help.help.name'),
      callback_data: 'help'
    }],
    [{
      text: '🖼 ' + temp.inline('command.help.img.name'),
      callback_data: 'help_image'
    }, {
      text: '🔍 ' + temp.inline('command.help.search.name'),
      callback_data: 'help_search'
    }],
    [{
      text: '👋 ' + temp.inline('command.help.start.name'),
      callback_data: 'help_start'
    }, {
      text: '✅ ' + temp.inline('command.help.uptime.name'),
      callback_data: 'help_uptime'
    }],
    [{
      text: '🔤 ' + temp.inline('command.help.lang.name'),
      callback_data: 'help_lang'
    }, {
      text: '📟 ' + temp.inline('command.help.me.name'),
      callback_data: 'help_me'
    }],
    [{
      text: '📺 ' + temp.inline('command.help.whatanime.name'),
      callback_data: 'help_whatanime'
    }, {
      text: '👋 ' + temp.inline('command.help.welcome.name'),
      callback_data: 'help_welcome'
    }],
    [{
      text: '👋 ' + temp.inline('command.help.leave.name'),
      callback_data: 'help_leave'
    }, {
      text: '💻 ' + temp.inline('command.help.msginfo.name'),
      callback_data: 'help_msginfo'
    }],
    [{
      text: '🌎 ' + temp.inline('command.help.homepage.name'),
      callback_data: 'help_homepage'
    }, {
      text: '🌨 ' + temp.inline('command.help.weather.name'),
      callback_data: 'help_weather'
    }],
    [{
      text: '😁 ' + temp.inline('command.help.contact'),
      url: 'https://t.me/small_sunshine'
    }]
  ]
}
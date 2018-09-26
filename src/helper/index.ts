import search from './search'
import lang from '../lang'
import * as Telegram from 'node-telegram-bot-api'
import { Logger } from 'log4js';
import * as types from '../types'
import Lang from '../lang'

export default {
  getuser (user: Telegram.User): string {
    if (!user.username) {
      return user.first_name
    } else {
      return user.username
    }
  },
  async getlang (msg: Telegram.Message | Telegram.InlineQuery | Telegram.CallbackQuery, logger: Logger): Promise<types.language.Lang> {
    try {
      let temp = new Lang(logger)
      await temp.set(msg)
      return temp
    } catch (e) {
      throw (e)
    }
  },
  commandlist (temp: types.language.Lang): any {
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
        url: 'help_msginfo'
      }],
      [{
        text: '🌎 ' + temp.inline('command.help.homepage.name'),
        callback_data: 'help_homepage'
      }, {
        text: '😁 ' + temp.inline('command.help.contact'),
        url: 'https://t.me/small_sunshine'
      }]
    ]
  },
  langlist (temp: lang): any {
    let list: any = temp.getLangList()
    let listResult = []
    for (let i in Object.keys(list)) {
      listResult.push(list[Object.keys(list)[i]].lang)
    }
    let result = []
    for (let i = 0; i < listResult.length - 1; i += 2) {
      if (typeof listResult[i + 1] === 'object') {
        result.push([{
          text: listResult[i].display,
          callback_data: 'changelang_' + listResult[i].code
        }, {
          text: listResult[i + 1].display,
          callback_data: 'changelang_' + listResult[i + 1].code
        }])
      } else {
        result.push([{
          text: listResult[i].display,
          callback_data: 'changelang_' + listResult[i].code
        }])
      }
    }
    return result
  },
  search: search.search,
  image: search.image
}

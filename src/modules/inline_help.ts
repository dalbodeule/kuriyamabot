import { inline as Inline } from '../moduleBase'
import * as Telegram from 'node-telegram-bot-api'

export default class InlineHelp extends Inline {
  protected async module (msg: Telegram.InlineQuery) {
    const q = {
      id: msg.id, query: msg.query
    }

    const match = q.query.match(/^(?:([help]+)(?:| (.*)+))$/)
    if (match) {
      try {
        this.logger.info('inline: help, inlineid: ' + q.id +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.query + ', type: pending')

        let temp = await this.helper.getlang(msg, this.logger)

        await this.bot.answerInlineQuery(q.id, [{
          type: 'article',
          title: 'help message',
          id: 'help',
          input_message_content: {
            message_text: temp.inline('command.help.help.name') + '\n\n' +
              '🖼 ' + temp.inline('command.help.img.name') + '\n\n' +
              '🔍 ' + temp.inline('command.help.search.name') + '\n\n' +
              '⚙️ ' + temp.inline('tobot'),
            parse_mode: 'HTML'
          },
          reply_markup: {
            inline_keyboard: [[{
              text: '🖼',
              switch_inline_query_current_chat: 'img'
            }, {
              text: '🔍',
              switch_inline_query_current_chat: 'search'
            }], [{
              text: '⚙️',
              url: 'https://t.me/' + this.config.bot.username
            }]]
          }
        }], {
          cache_time: 3
        })
        this.logger.info('inline: help, inlineid: ' + q.id +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.query + ', type: success')
      } catch (e) {
        this.logger.error('inline: help, inlineid: ' + q.id +
          ', username: ' + this.helper.getuser(msg.from) +
          ', command: ' + msg.query + ', type: error')
        this.logger.debug(e.stack)
      }
    }
  }
}

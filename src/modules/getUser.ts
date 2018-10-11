import * as Telegram from 'node-telegram-bot-api'

export default (user: Telegram.User): string => {
  if (!user.username) {
    return user.first_name
  } else {
    return user.username
  }
}
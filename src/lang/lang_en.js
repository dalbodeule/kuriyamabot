module.exports = {
  lang: {
    langname: 'English',
    display: '🇺🇸 English',
    code: 'en'
  },
  command: {
    start: 'Hello, I am {botname}.\nThe language you use can be seen by using /me@{botid}.\nIf you want to use another language, please use /lang@{botid}.',
    uptime: {
      message: 'This bot is currently running for {hour} hour {min} minutes {sec} seconds.',
      hour: 'hour',
      min: 'minutes',
      sec: 'seconds'
    },
    search: {
      not_found: 'Hmm.. No results found!',
      error: 'There was a problem sending your search results!\nTry <b>{botid} google {keyword}</b>!',
      blank: 'Please enter your search words!',
      result: 'Search results',
      visit_page: 'Visit Page',
      another: 'Other Search Results',
      desc_null: 'Go to the URL for more information!',
      bot_blcok: "Due to Google's anti-bot policy, it is not searchable. Please try again in a few minutes.",
      visit_google: 'Search by Google'
    },
    img: {
      not_found: 'Hmm.. No results found!',
      error: 'There was a problem sending the image!\nTry it with <b>{botid} img {keyword}</b>!',
      blank: 'Please enter your search words!',
      visit_page: 'Visit Page',
      view_image: 'View Image',
      another: 'Other Search Results'
    },
    lang: {
      isgroup: 'You can not change the language in Group Chat. Thank you for your personal chat.',
      announce: 'If you would like to change the language to use, please select from the list below.',
      success: '🇺🇸 The language to be used in English has changed.',
      error: 'Failed to change language. Please try again.'
    },
    whatanime: {
      name: 'Japanese name',
      english: 'English name',
      episode: 'Episode',
      time: 'Time',
      match: 'accuracy',
      info: 'Please reply with an animated screenshot and you can search what animations are.',
      incorrect: 'This is not exactly ...',
      isAdult: 'For adult animation, it does not provide a preview.'
    },
    welcome: {
      success: 'The message is set up well.',
      help: 'How to write an entry message: {roomid} specifies the name of this room, and {userid} is the name of the user. If you turn off, you will not get an entry message.' +
        '\n Examples: `Welcome to {roomid}, {userid}!`'
    },
    leave: {
      success: 'The message is set up well.',
      help: 'How to write an entry message: {roomid} specifies the name of this room, and {userid} is the name of the user. If you turn off, you will not get a message to leave.' +
        '\n Examples: `{userid} has been removed from {roomid}.`'
    },
    lowPermission: 'You lack the authority to do this.',
    isnotgroup: 'You can not do this unless you are a group or a super group.',
    me: 'User ID: {userid}\nFirst name: {fname}\nLast name: {lname}\n ID: {name}\nUse language: {lang}\n',
    help: {
      help: {
        name: 'Help',
        description: "Here's what this bot can do:\nClick on one of the features below to learn how to use it!",
        how: '/help{botid}'
      },
      img: {
        name: 'Image search',
        description: 'You can search for images in Google.',
        how: '/img{botid} (search word)'
      },
      search: {
        name: 'Google Search',
        description: 'You can search on Google.',
        how: '/google{botid} (search word)'
      },
      start: {
        name: 'Start',
        description: 'This is a command to wake up the bot.\nYou can use this bot if you use this command.',
        how: '/start{botid}'
      },
      uptime: {
        name: 'Bot Uptime',
        description: 'You can see how long this bot has been running.',
        how: '/uptime{botid}'
      },
      lang: {
        name: 'Change your language',
        description: 'Change the language to use here.',
        how: '/lang{botid}'
      },
      me: {
        name: 'My Info',
        description: 'You can see your own information.',
        how: '/me{botid}'
      },
      whatanime: {
        name: 'whatanime',
        description: 'You can find out what animations are in the screenshots of the animation.',
        how: '/whatanime{botid}'
      },
      welcome: {
        name: 'Custom entry message',
        description: 'You can set an entry message for this room.',
        how: '/welcome{botid}'
      },
      leave: {
        name: 'Custom exit message',
        description: 'You can set a message to leave this room.',
        how: '/leave{botid}'
      },
      twice: 'Here are some tips you already have!',
      contact: 'Contact Developer'
    }
  },
  message: {
    except: 'error. Stickers and images can not be processed.',
    join: '{userid}, welcome to {roomid}.',
    left: '{userid} has left {roomid}.',
    botjoin: 'Hello, Thank you for allowing me to work in this room. Thank you very much.',
    error: "Something's wrong!"
  },
  tobot: 'Go to bot'
}

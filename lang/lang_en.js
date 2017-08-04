module.exports = {
    command: {
        start: "Hello, I am {arg2}.\nThe language you use can be seen by using /me@{arg1}.\nIf you want to use another language, please use /lang@{arg1}.",
        uptime: "This bot is currently running for {arg1}.",
        search: {
            not_found: "Hmm.. No results found!",
            error: "There was a problem sending your search results!\nTry <b>{arg1} google {arg2}</b>!",
            blank: "Please enter your search words!",
            result: "Search results"
        }, img: {
            not_found: "Hmm.. No results found!",
            error: "There was a problem sending the image!\nTry it with <b>{arg1} img {arg2}</b>!",
            blank: "Please enter your search words!"
        }, lang: {
            isgroup: "You can not change the language in Group Chat. Thank you for your personal chat.",
            announce: "If you would like to change the language to use, please select from the list below.",
            success: "🇺🇸 The language to be used in English has changed.",
            error: "Failed to change language. Please try again."
        }, me: "User ID: {arg1}\nFirst name: {arg2}\nLast name: {arg3}\n"
            +"ID: {arg4}\nUse language: {arg5}\n",
        help: {
            help: {
                name: "Help",
                description: "Here's what this bot can do:\nClick on one of the features below to learn how to use it!",
                how: "/help{arg1}"
            },
            img: {
                name: "Image search",
                description: "You can search for images in Google.",
                how: "/img{arg1} (search word)"
            }, search: {
                name: "Google Search",
                description: "You can search on Google.",
                how: "/google{arg1} (search word)"
            }, start: {
                name: "Start",
                description: "This is a command to wake up the bot.\nYou can use this bot if you use this command.",
                how: "/start{arg1}"
            }, uptime: {
                name: "Bot Uptime",
                description: "You can see how long this bot has been running.",
                how: "/uptime{arg1}"
            }, lang: {
                name: "Change your language",
                description: "Change the language to use here.",
                how: "/lang{arg1}"
            }, me: {
                name: "My Info",
                description: "You can see your own information.",
                how: "/me{arg1}"
            }, twice: "Here are some tips you already have!"
        }
    }, message: {
        except: "error. Stickers and images can not be processed.",
        join: "{arg2}, welcome to {arg1}.",
        left: "{arg2} has left {arg1}.",
        botjoin: "Hello, Thank you for allowing me to work in this room. Thank you very much.",
        error: "Something's wrong!"
    }, inline: {
        img: {
            visit_page: "Visit Page",
            view_image: "View Image",
            not_found: "Hmm .. No results found!",
            error: "I'm having trouble sending images!\nPlease try again!"
        }, search: {
            visit_page: "Visit Page",
            another: "Other Search Results",
            not_found: "Hmm .. No results found!",
            error: "I'm having trouble sending search results!\nPlease try again!",
            desc_null: "Go to the URL for more information!"
        }, tobot: "Go to bot"
    }
}
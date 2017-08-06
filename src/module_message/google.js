"use strict";

module.exports = (bot, logger, modules, msg) => {
    if(msg.reply_to_message.text.match(/🔍/) != null ) {
        require('./google_search.js')(bot, logger, modules, msg); //google search
    } else if(msg.reply_to_message.text.match(/🖼/) != null) {
        require('./google_image.js')(bot, logger, modules, msg); //img search
    }
}
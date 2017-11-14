"use strict";

module.exports = async (bot, logger, modules, msg) => {
    try {
        let temp = await modules.getlang(msg, logger);
        if(msg.reply_to_message.text.match() != null ) {
            require('./google_search.js')(bot, logger, modules, msg, temp); //google search
        } else if(msg.reply_to_message.text.match(new RegExp("🖼 "+temp.text(msg.chat.type, 'command.img.blank'))) != null) {
            require('./google_image.js')(bot, logger, modules, msg, temp); //img search
        }
    } catch(e) {
        logger.error('error');
        logger.debug(e);
    }
}
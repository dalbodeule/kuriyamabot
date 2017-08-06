"use strict";

module.exports = (bot, logger, modules, msg, tcom) => {
    logger.debug('caht command type: '+tcom[1]);
    logger.debug('caht command keyword: '+tcom[2]);
    if(tcom[1] == 'img' || tcom[1] == '사진' || tcom[1] == '이미지' || tcom[1] == '짤') {
        require('./chatCommand_image.js')(bot, logger, modules, msg, tcom); //text command image search
    } else if(tcom[1] == 'gg' || tcom[1] == '문서' || tcom[1] == '검색'
        || tcom[1] == '구글' || tcom[1] == 'google') {
        require('./chatCommand_search.js')(bot, logger, modules, msg, tcom); //text command search
    }
}
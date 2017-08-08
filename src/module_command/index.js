"use strict";
module.exports = async(bot, logger, modules) => {
	const searchModule = require('../modules/search.js'), glob = require('glob-promise'),
	path = require('path');

	try{
		let items = await glob(path.join(__dirname, './command_*.js'));
		
		for(let i in items) {
			require(items[i])(bot, logger, modules);
		}
		logger.debug('Command: Load complete');
	} catch(e) {
		logger.error(e);
	}

    /*require('./command_start.js')(bot, logger, modules); // /start
    require('./command_uptime.js')(bot, logger, modules); // /uptime
    require('./command_search_success.js')(bot, logger, modules); // /search if success
    require('./command_search_fail.js')(bot, logger, modules); // /search if error
	require('./command_image_success.js')(bot, logger, modules); // /img if success
    require('./command_image_fail.js')(bot, logger, modules); // /img if error
    require('./command_help.js')(bot, logger, modules); // /help
	require('./command_lang.js')(bot, logger, modules); // /lang
    require('./command_me.js')(bot, logger, modules); // /me*/

	/*bot.onText(/\/inline+/, (msg, match) => {
		const chatid = msg.chat.id;
		
		bot.sendMessage(chatid, 'inline keyboard is setuped!', {
			reply_markup: {
				inline_keyboard: [[{
					text: 'naver',
					url: 'https://www.naver.com/'
				},{
					text: 'google',
					url: 'https://google.com'
				}]]
			}
		});
		
		logger.info('chatid: '+chatid+', command: '+msg.text+', type: valid');
	});
    
	bot.onText(/\/keyboard+/, (msg, match) => {
		const chatid = msg.chat.id;
		
		bot.sendMessage(chatid, 'keyboard is setuped!', {
			reply_markup: {
				keyboard: [
					["!start"], ["!inline"]
				],
				one_time_keyboard: true,
				resize_keyboard: true,
                selective: true
			}
		});
		logger.info('chatid: '+chatid+', command: '+msg.text+', type: valid');
	});*/
}
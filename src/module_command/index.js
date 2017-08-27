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
}
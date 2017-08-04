"use strict";
module.exports = {
    getuser: (user) => {
		if(user.username == undefined) {
			return user.first_name;
		} else {
			return user.username;
		}
	},
	getlang: async(msg, logger) => {
		return new Promise(async(resolve, reject) => {
			try {
				const lang = require('../lang');
				let temp = new lang();
				let result = await temp.set(msg, logger);
				resolve(temp);
			} catch(e) {
				reject(e);
			}
		})
	},
	commandlist: (temp) => {
		return [
			[{
				text: "📒 "+temp.inline('command.help.help.name'),
				callback_data: 'help'
			}],
			[{
				text: "🖼 "+temp.inline('command.help.img.name'),
				callback_data: 'help_image'
			},{
				text: "🔍 "+temp.inline('command.help.search.name'),
				callback_data: 'help_search'
			}],
			[{
				text: "👋 "+temp.inline('command.help.start.name'),
				callback_data: 'help_start'
			},{
				text: "✅ "+temp.inline('command.help.uptime.name'),
				callback_data: 'help_uptime'
			}],
			[{
				text: "🔤 "+temp.inline('command.help.lang.name'),
				callback_data: 'help_lang'
			}, {
				text: "📟 "+temp.inline('command.help.me.name'),
				callback_data: 'help_me'
			}]
		];
	},
	langlist: () => {
		return [
			[{
				text: "🇰🇷 한국어",
				callback_data: 'changelang_ko'
			}, {
				text: "🇺🇸 English",
				callback_data: 'changelang_en'
			}]
		];
	}
}
"use strict";
const search = require('./search');
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
			}],
			[{
				text:"😁 "+temp.inline("command.help.contact"),
				url: "https://t.me/small_sunshine"
			}]
		];
	},
	langlist: (temp) => {
		let list = temp.getLangList();
		let listResult = [];
		for(let i in Object.keys(list)) {
			listResult.push(list[Object.keys(list)[i]].lang);
		}
		let result = [];
		for(let i=0; i < listResult.length-1; i += 2) {
			if(typeof listResult[i+1] == 'object') {
				result.push([{
					text: listResult[i].display,
					callback_data: 'changelang_'+listResult[i].code
				}, {
					text: listResult[i+1].display,
					callback_data: 'changelang_'+listResult[i+1].code
				}]);
			} else {
				result.push([{
					text: listResult[i].display,
					callback_data: 'changelang_'+listResult[i].code
				}]);
			}
		}
		return result;
	},
	search: search.search,
	imge: search.image
}
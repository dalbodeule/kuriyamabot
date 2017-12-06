"use strict";
const objectPath = require('object-path'), language = require('languages'),
	db = require('./db') , glob = require('glob-promise'),
	path = require('path'), Seuelize = require('sequelize');
const langs = {};

module.exports = class {
	constructor() {
		this.id = '';
		this.lang =  '';
		this.logger;
		this.ready = false;
	}
	
	async set(msg, logger) {
		return new Promise(async(resolve, reject) => {
			if(Object.keys(langs).length == 0) {
				logger.info('Language: Language not loaded');
				await(async() => {
					let items = await glob(path.join(__dirname, 'lang_*.json'));
					for(let i of items) {
						let temp = require(i);
						langs[temp.lang.langname] = temp;
						logger.info('Language: \"'+temp.lang.langname+'\" Load complete');
					}
				})();
				logger.info('Language: Language load complete');
				this.ready = true;
			} else {
				this.ready = true;
			}

			if(typeof msg.from.language_code == 'undefined') {
				resolve(undefined);
			} else {
				this.id = msg.from.id;
				this.logger = logger;
				try {
					let query = await db.user.findOne({
						where: {
							id: this.id
						},
						attributes: [
							'id',
							'lang'
						]
					});
					if(!query.get || !query.get('lang')) {
						this.lang = msg.from.language_code.split('-')[0];
						resolve(query);
						logger.debug(this.id+' '+this.lang);
						db.user.create({
							id: this.id,
							lang: this.lang
						});
					} else {
						this.lang = query.lang;
						logger.debug('id: '+this.id+', lang: '+this.lang);
						resolve(query);
					}
				} catch(e) {
					reject(e);
				}
			}
		});
	}

	async langset(lang) {
		return new Promise(async(resolve, reject) => {
			let isExist = false;
			for(let i in Object.keys(langs)) {
				if(langs[Object.keys(langs)[i]].lang.code == lang) {
					isExist = true;
				}
			}
			if(isExist == false) {
				reject(Error(lang+' is not a valid value'))
			}
			try {
				let query = await db.user.update({
					lang: lang
				}, {
					where: {
						id: this.id
					}
				});
				this.lang = lang;
				this.logger.debug({id: this.id, lang: this.lang});
				resolve();
			} catch(e) {
				reject(e);
			}
		});
	}
	
	person(code) {
		if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
			return objectPath.get(langs.Korean, code)+"\n\n"+objectPath.get(langs.English, code);
		} else {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code);
		}
	}
	
	inline(code) {
		if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
			return objectPath.get(langs.Korean, code)+
				"("+objectPath.get(langs.English, code)+')';
		} else if(language.getLanguageInfo(this.lang).name == 'English') {
			return objectPath.get(langs.English, code);
		} else {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code)+
				'('+objectPath.get(langs.English, code)+')';
		}
	}
	
	group(code) {
		if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
			return objectPath.get(langs.Korean, code)+
				"\n"+objectPath.get(langs.English, code);
		} else if(language.getLanguageInfo(this.lang).name == 'English' ||
			typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code);
		} else {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code)+
				"\n"+objectPath.get(langs.English, code);
		}
	}

	help(code) {
		if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
			return objectPath.get(langs.Korean, code+'.name')+
			' ('+objectPath.get(langs.English, code+'.name')+")\n\n"+
			objectPath.get(langs.Korean, code+'.description')+
			"\n"+objectPath.get(langs.English, code+'.description')+"\n\n"+
			objectPath.get(langs.Korean, code+'.how').replace(/{botid}/g, '@'+global.botinfo.username)+
			' ( '+objectPath.get(langs.English, code+'.how').replace(/{botid}/g, '@'+global.botinfo.username)+' )';
		} else if(langs[language.getLanguageInfo(this.lang).name] == 'English') {
			return objectPath.get(langs.English, code+'.name')+"\n\n"+
			objectPath.get(langs.English, code+'.description')+"\n\n"+
			objectPath.get(langs.English, code+'.how').replace(/{botid}/g, '@'+global.botinfo.username);
		} else {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.name')+
			' ('+objectPath.get(langs.English, code+'.name')+")\n\n"+
			objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.description')+
			"\n"+objectPath.get(langs.English, code+'.description')+"\n\n"+
			objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.how').replace(/{botid}/g, '@'+global.botinfo.username)+
			' ( '+objectPath.get(langs.English, code+'.how').replace(/{botid}/g, '@'+global.botinfo.username)+' )';
		}
	}

	text(type, code) {
		if(type == 'group' || type == 'supergroup' || type == 'channel') {
			if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
				return objectPath.get(langs.Korean, code)+
					"\n"+objectPath.get(langs.English, code);
			} else if(language.getLanguageInfo(this.lang).name == 'English') {
				return objectPath.get(langs.English, code);
			} else {
				return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code)+
					"\n"+objectPath.get(langs.English, code);
			}
		} else if(type == 'private') {
			if(typeof this.lang == 'undefined' || typeof langs[language.getLanguageInfo(this.lang).name] == 'undefined') {
				return objectPath.get(langs.Korean, code)+"\n\n"+objectPath.get(langs.English, code);
			} else {
				return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code);
			}
		}
	}

	getLangList() {
		return langs;
	}
}
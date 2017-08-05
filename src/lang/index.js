"use strict";
const objectPath = require('object-path'), language = require('languages'),
	sqlite = require('sqlite3');
const langs = {
    Korean: require('./lang_ko'),
    English: require('./lang_en')
}

module.exports = class {
	constructor() {
		this.id = '';
		this.lang =  '';
		this.logger;
	}
	
	async set(msg, logger) {
		return new Promise(async(resolve, reject) => {
			if(typeof msg.from.language_code == 'undefined') {
				resolve(undefined);
			} else {
				this.id = msg.from.id;
				this.logger = logger;
				let db = new sqlite.Database('./database.sqlite');
				try {
					db = await((db) => {
						return new Promise((resolve, reject) => {
							db.serialize(() => {
								resolve(db);
							});
						});
					})(db);
					let query = await((db) => {
						return new Promise((resolve, reject) => {
							db.get('select * from user where id = ?', this.id, (err, row) => {
								if(err) reject(err);
								else resolve(row);
							});
						});
					})(db);
					if(typeof query == 'undefined' || typeof query.lang == 'undefined') {
						this.lang = msg.from.language_code.split('-')[0];
						resolve(query);
						logger.debug(this.id+' '+this.lang);
						db.run("INSERT into user (id, lang) values (?, ?)",
							[this.id, this.lang]);
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

	async langset(lang, msg) {
		return new Promise(async(resolve, reject) => {
			let db = new sqlite.Database('./database.sqlite');
			try {
				db = await((db) => {
					return new Promise((resolve, reject) => {
						db.serialize(() => {
							resolve(db);
						});
					});
				})(db);
				let query = await((db) => {
					return new Promise((resolve, reject) => {
						db.run('update user set lang = ? where id = ?', [lang, this.id], (err) => {
							if(err) reject(err);
							else resolve();
						});
					});
				})(db);
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
			objectPath.get(langs.Korean, code+'.how').replace(/{arg1}/g, '@'+global.botinfo.username)+
			' ( '+objectPath.get(langs.English, code+'.how').replace(/{arg1}/g, '@'+global.botinfo.username)+' )';
		} else if(langs[language.getLanguageInfo(this.lang).name] == 'English') {
			return objectPath.get(langs.English, code+'.name')+"\n\n"+
			objectPath.get(langs.English, code+'.description')+"\n\n"+
			objectPath.get(langs.English, code+'.how').replace(/{arg1}/g, '@'+global.botinfo.username);
		} else {
			return objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.name')+
			' ('+objectPath.get(langs.English, code+'.name')+")\n\n"+
			objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.description')+
			"\n"+objectPath.get(langs.English, code+'.description')+"\n\n"+
			objectPath.get(langs[language.getLanguageInfo(this.lang).name], code+'.how').replace(/{arg1}/g, '@'+global.botinfo.username)+
			' ( '+objectPath.get(langs.English, code+'.how').replace(/{arg1}/g, '@'+global.botinfo.username)+' )';
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
}
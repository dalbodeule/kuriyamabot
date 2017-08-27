"use static";
const google = require('google-parser');
module.exports = {
    search: async(keyword) => {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await google.search(keyword+" -ilbe.com");
                if(res == false) {
                    resolve(false);
                }
                if(typeof res == 'undefined') {
                    resolve(undefined);
                } else {
                    let response = '';
                    for(let i=0; i<3; i++) {
                        if(typeof(res[i]) != 'undefined') {
                            response = response+"\n"+'<a href="'+res[i].link+'">'+res[i].title+'</a>'+"\n"+
                                (res[i].description != '' ? res[i].description.replace('&', '&amp;')
                                    .replace('<', '&lt;').replace('>', '&gt;')+"\n\n" : '');
                        }
                    }
                    resolve(response);
                }
            } catch(e) {
                reject(e);
            }
        });
    },
    image: async(keyword) => {
        return new Promise(async(resolve, reject) => {
            try {
                function getRandomIntInclusive(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                let res = await google.img(keyword+" -ilbe.com");
                if(typeof res[0] == 'undefined') {
                    resolve(undefined);
                } else {
                    let random = getRandomIntInclusive(0, (res.length < 20 ? res.length - 1 : 19));
                    resolve({img: res[random].img, url: res[random].url})
                }
            } catch(e) {
                reject(e);
            }
        });
    }
}
"use static";
const google = require('google-parser');
module.exports = {
    search: (keyword) => {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await google.search(keyword+" -site:ilbe.com");
                if(res == false) {
                    resolve(false);
                }
                if(typeof res == 'undefined') {
                    resolve(undefined);
                } else {
                    let response = '';
                    for(let i=0; i<3; i++) {
                        if(typeof(res[i]) != 'undefined') {
                            let tempDesc = res[i].description;
                            if(tempDesc.length > 27) {
                                tempDesc = tempDesc.substr(0, 30) + '...';
                            }
                            tempDesc.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
                            response = response+"\n"+'<a href="'+res[i].link+'">'+res[i].title+'</a>'+"\n"+
                                (!res[i].description ? '' : tempDesc+"\n\n")
                        }
                    }
                    resolve(response);
                }
            } catch(e) {
                reject(e);
            }
        });
    },
    image: (keyword) => {
        return new Promise(async(resolve, reject) => {
            try {
                function getRandomIntInclusive(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                let res = await google.img(keyword+" -site:ilbe.com");
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
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("google-parser");
class Search {
    static search(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield google.search(keyword + ' -site:ilbe.com');
            if (res.error) {
                return res;
            }
            else if (!res) {
                return undefined;
            }
            else {
                let response = '';
                for (let i = 0; i < 3; i++) {
                    if (typeof (res[i]) !== 'undefined') {
                        let tempDesc = res[i].description;
                        if (tempDesc.length > 27) {
                            tempDesc = tempDesc.substr(0, 30) + '...';
                        }
                        tempDesc.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
                        response = response + '\n' + '<a href="' + res[i].link + '">' +
                            res[i].title + '</a>' + '\n' +
                            (!res[i].description ? '' : tempDesc + '\n\n');
                    }
                }
                return response;
            }
        });
    }
    static image(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            function getRandomIntInclusive(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function removeMatching(originalArray, regex) {
                let j = 0;
                while (j < originalArray.length) {
                    if (regex.test(originalArray[j].img)) {
                        originalArray.splice(j, 1);
                    }
                    else {
                        j++;
                    }
                }
                return originalArray;
            }
            let res = yield google.img(keyword + ' -site:ilbe.com');
            res = removeMatching(res, /^x-raw-image:\/\/\/.*$/);
            if (typeof res[0] === 'undefined') {
                return undefined;
            }
            else {
                let random = getRandomIntInclusive(0, (res.length < 20 ? res.length - 1 : 19));
                return { img: res[random].img, url: res[random].url };
            }
        });
    }
}
exports.default = Search;

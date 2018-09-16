"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(time) {
        this.time = time;
        return;
    }
    get hour() {
        return this.pad(Math.floor(this.time / (60 * 60)));
    }
    get min() {
        return this.pad(Math.floor(this.time % (60 * 60) / 60));
    }
    get sec() {
        return this.pad(Math.floor(this.time % 60));
    }
    pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
}
exports.default = default_1;

module.exports = class {
  constructor (time) {
    this.time = time
    return true
  }
  get hour () {
    return this.pad(Math.floor(this.time / (60 * 60)))
  }
  get min () {
    return this.pad(Math.floor(this.time % (60 * 60) / 60))
  }
  get sec () {
    return this.pad(Math.floor(this.time % 60))
  }
  pad (s) {
    return (s < 10 ? '0' : '') + s
  }
}

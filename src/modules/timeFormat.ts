export default class TimeFormat {
  public time: number

  constructor(time: number) {
    this.time = time
    return
  }
  get hour() {
    return this.pad(Math.floor(this.time / (60 * 60)))
  }
  get min() {
    return this.pad(Math.floor(this.time % (60 * 60) / 60))
  }
  get sec() {
    return this.pad(Math.floor(this.time % 60))
  }
  private pad(s: number) {
    return (s < 10 ? "0" : "") + s
  }
}

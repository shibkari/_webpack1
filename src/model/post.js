export default class Post {
  constructor(title, img) {
    this.title = title
    this.date = new Date()
    this.image = img
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      image: this.image,
      date: this.date.toJSON()
  }, null, 2)
  }
}

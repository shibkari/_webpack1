let unused = 'unused'
console.log(unused)

export default class Post {
  constructor(title, img) {
    this.title = title
    this.date = new Date()
    this.image = img
  }

  toString() {
    return JSON.stringify({
      date: this.date.toJSON(),
      image: this.image,
      title: this.title
    }, null, 2)
  }
}

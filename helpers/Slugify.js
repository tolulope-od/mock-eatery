class Slug {
  constructor(string) {
    this.string = string;
  }

  generateSlug() {
    return this.string
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  generateUniqueSlug() {
    const regularSlug = this.generateSlug();
    const randomNumber = Math.floor(Math.random() * 100000);
    const slug = `${regularSlug}-${Date.now()}-${randomNumber}`;
    return slug;
  }
}

export default Slug;

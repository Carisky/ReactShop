class RecomendedProducts {
  static key = "RecomendedProductsTags";
  static limit = 10;

  
  static get() {
    const tags = localStorage.getItem(this.key);
    if (tags) {
      return JSON.parse(tags);
    } else {
      const initialTags = {};
      localStorage.setItem(this.key, JSON.stringify(initialTags));
      return initialTags;
    }
  }

  
  static increment(tag) {
    const tags = this.get();
    if (tags[tag]) {
      if (tags[tag] != this.limit) {
        tags[tag]++;
      }
    } else {
      tags[tag] = 1;
    }
    localStorage.setItem(this.key, JSON.stringify(tags));
  }

  
  static reset() {
    const initialTags = {};
    localStorage.setItem(this.key, JSON.stringify(initialTags));
  }

  static getMostVisited(limit = null) {
    const tags = this.get();
    const sortedTags = Object.entries(tags).sort(
      ([, countA], [, countB]) => countB - countA
    );

    if (limit !== null) {
      return sortedTags.slice(0, limit).map(([tag, count]) => ({ tag, count }));
    } else {
      return sortedTags.map(([tag, count]) => ({ tag, count }));
    }
  }
}

export default RecomendedProducts;

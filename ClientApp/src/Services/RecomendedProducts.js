class RecomendedProducts {
    static key = "RecomendedProductsTags";

    // Get the tags from localStorage
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

    // Increment the count for a specific tag
    static increment(tag) {
        const tags = this.get();
        if (tags[tag]) {
            tags[tag]++;
        } else {
            tags[tag] = 1;
        }
        localStorage.setItem(this.key, JSON.stringify(tags));
    }

    // Reset the tags to an empty object
    static reset() {
        const initialTags = {};
        localStorage.setItem(this.key, JSON.stringify(initialTags));
    }

    static getMostVisited(limit = null) {
        const tags = this.get();
        const sortedTags = Object.entries(tags)
            .sort(([, countA], [, countB]) => countB - countA);

        if (limit !== null) {
            return sortedTags.slice(0, limit).map(([tag, count]) => ({ tag, count }));
        } else {
            return sortedTags.map(([tag, count]) => ({ tag, count }));
        }
    }
}

export default RecomendedProducts;

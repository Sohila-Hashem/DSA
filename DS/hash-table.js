export default class HashTable {
    #size;
    #loadFactor;
    #loadFactorLimit = 0.7;

    constructor(length = 3333) {
        this.bucket = new Array(length);
        this.#size = 0;
    }

    get size() {
        return this.#size;
    }

    // hash a key
    #hash(key, length) {
        let hash = 17;

        for (let i = 0; i < key.length; i++) {
            hash *= key.charCodeAt(i) * 13;
        }

        return hash % length;
    }

    // resize the table
    #resize() {
        const newBucket = new Array(this.bucket.length * 2);

        for (let i = 0; i < this.bucket.length; i++) {
            const entry = this.bucket[i];

            if (entry) {
                entry.forEach((subEntry) => {
                    const newIndex = this.#hash(subEntry[0], newBucket.length);
                    const newEntry = newBucket[newIndex];

                    if (newEntry) {
                        newEntry.push(subEntry);
                    } else {
                        newBucket[newIndex] = [subEntry];
                    }
                });
            }
        }

        this.bucket = newBucket;
    }

    // set a key value pair
    setKey(key, value) {
        this.#size++;
        this.#loadFactor = this.size / this.bucket.length;

        if (this.#loadFactor > this.#loadFactorLimit) {
            this.#resize();
        }

        const index = this.#hash(key, this.bucket.length);
        const entry = this.bucket[index];

        if (entry) {
            // check if the key already exists and if yes,
            // update it
            entry.forEach((subEntry, index) => {
                if (subEntry[0] === key) {
                    entry[index][1] = value;
                }
            });
        } else {
            this.bucket[index] = [[key, value]];
        }
    }

    getKey(key) {
        const index = this.#hash(key, this.bucket.length);
        const entry = this.bucket[index];

        if (entry) {
            let foundEntry;

            entry.forEach((subEntry) => {
                if (subEntry[0] === key) {
                    foundEntry = subEntry;
                }
            });

            return foundEntry[1];
        }

        return null;
    }

    removeKey(key) {
        const index = this.#hash(key, this.bucket.length);
        let entry = this.bucket[index];

        if (entry) {
            if (entry.length > 1) {
                entry.forEach((subEntry, index) => {
                    if (subEntry[0] === key) {
                        entry.splice(index, 1);
                    }
                });
            } else {
                this.bucket[index] = undefined;
            }

            this.#size--;
            return true;
        }

        return null;
    }
}

// const ht = new HashTable(3);
// ht.setKey("Name", "Sohila");
// ht.setKey("Age", "22");
// ht.setKey("Age", "21");
// ht.setKey("Gender", "F");
// ht.setKey("Job", "Software");
// ht.setKey("MStatus", "Married");

// console.log(ht.bucket.length);
// console.log(ht.getKey("Age"));
// console.log(ht.bucket);

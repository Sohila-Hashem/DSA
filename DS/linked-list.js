export class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

export class LinkedList {
    #head;
    #tail;
    #size;

    constructor(head = null) {
        this.#head = head;
        this.#tail = null;
        this.#size = 0;
    }

    // returns a deep copy of the Head
    getHead() {
        return Object.assign({}, this.#head);
    }

    getTail() {
        return Object.assign({}, this.#tail);
    }

    get size() {
        return [this.#size][0];
    }

    // insert to the first
    insertHead(data) {
        if (data === undefined)
            throw new Error("argument data must be defined");

        const node = new Node(data, this.#head);

        this.#head = node;

        if (!this.#tail) {
            this.#tail = node;
        }

        this.#size++;
    }

    // insert to the end
    insert(data) {
        if (data === undefined) throw new Error("argument must be defined");

        let node = new Node(data);

        if (!this.#tail && !this.#head) {
            this.#head = node;
        } else {
            this.#tail.next = node;
        }

        this.#tail = node;
        this.#size++;
        return;
    }

    // insert at a giving index
    insertAt(position, data) {
        if (data === undefined || position === undefined)
            throw new Error("position and data arguments must be defined");

        let currentIndex = 1;
        let current = this.#head;

        if (position > this.#size || position < 1) {
            throw new Error("Position is out of range");
        }

        if (position === 1) {
            return this.insertHead(data);
        }

        if (position === this.#size) {
            this.insert(data);
            return;
        }

        while (current) {
            if (currentIndex === position - 1) {
                current.next = new Node(data, current.next);
                this.#size++;
                return;
            } else {
                current = current.next;
                currentIndex++;
            }
        }
        return;
    }

    // remove first
    removeHead() {
        this.#head = this.#head.next;
        this.#size--;
    }

    // remove at the end
    remove() {
        let current = this.#head;

        while (current) {
            if (current.next.next === null) {
                this.#tail = current;
                current.next = null;
                this.#size--;
                break;
            }
            current = current.next;
        }
        return;
    }

    // remove at a given position
    removeAt(position) {
        if (position === undefined) throw new Error("position must be defined");

        let currentIndex = 1;
        let current = this.#head;

        if (position < 1 || position > this.#size) {
            throw new Error("Position out of range");
        }

        if (position === 1) {
            return this.removeHead();
        }

        if (position === this.#size) {
            return this.remove();
        }

        while (current) {
            if (currentIndex === position) {
                current.next = current.next.next;
                return;
            }
            current = current.next;
            currentIndex++;
        }
        return;
    }

    // clear the list
    clearList() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    // return and print a specific node
    getAt(position) {
        if (position === undefined) throw new Error("position must be defined");

        let currentIndex = 1;
        let current = this.#head;

        if (position < 1 || position > this.#size) {
            throw new Error("Position out of range");
        }

        if (position === 1) {
            return this.getHead();
        }

        if (position === this.#size) {
            return this.getTail();
        }

        while (current) {
            if (currentIndex === position - 1) {
                console.log(current.data);
                return current.data;
            }
            current = current.next;
            currentIndex++;
        }
    }

    // print the list data
    printList() {
        let current = this.#head;

        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }

    // returns the linked list into an array
    toArray() {
        const llArray = [];
        let current = this.#head;

        while (current) {
            llArray.push(current);
            current = current.next;
        }

        return llArray;
    }
}

// const ll = new LinkedList();

// ll.insert("Sohila");
// ll.insert("Ahmed");
// ll.insert("Mohamed");
// ll.insert("A");

// ll.insertHead("Samir");

// ll.insertAt(ll.size, "Amra");
// ll.insertAt(2, "Waffle");
// ll.insertAt(1, "Sef");

// ll.removeHead();

// ll.remove();

// ll.removeAt(3);

// console.log(ll.getTail());

// console.log(ll.getHead());

// console.log(ll.getAt(1));

// console.log(ll.size);

class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

class LinkedList {
    constructor(head = null) {
        this.head = head;
        this.tail = null;
        this.size = 0;
    }

    // insert to the first
    insertHead(data) {
        const node = new Node(data, this.head);

        if (!this.tail) {
            this.tail = node;
        }

        this.size++;
    }

    // insert to the end
    insert(data) {
        let node = new Node(data);

        if (!this.tail && !this.head) {
            this.head = node;
        } else {
            this.tail.next = node;
        }

        this.tail = node;
        this.size++;
        return;
    }

    // insert at a giving index
    insertAt(index, data) {
        let currentIndex = 1;
        let current = this.head;

        if (index > this.size || index < 1) {
            console.log("Index is out of range");
            return;
        } else if (index === 1) {
            this.insertHead(data);
            return;
        }

        while (current) {
            if (currentIndex === index) {
                current.next = new Node(data, current.next);
                this.size++;
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
        this.head = this.head.next;
        this.size--;
    }

    // remove at the end
    // { data: "012", next: { data: "234", next: null }}
    removeTail() {
        let current = this.head;

        while (current) {
            if (current.next.next === null) {
                this.tail = current;
                current.next = null;
                this.size--;
            }
            current = current.next;
        }
        return;
    }

    // remove at a given index
    removeAt(index) {
        let currentIndex = 1;
        let current = this.head;

        while (current) {
            if (currentIndex === index) {
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
        this.head = null;
        this.size = 0;
    }

    // return and print a specific node
    getAt(index) {
        let currentIndex = 0;
        let current = this.head;

        if (index < 1 || index > this.size) {
            console.log("Index out of range");
            return;
        } else if (index === 1) {
            console.log(this.head.data);
            return this.head.data;
        } else if (index === this.size) {
            console.log(this.tail.data);
            return this.tail.data;
        }

        while (current) {
            if (currentIndex === index) {
                console.log(current.data);
                return current.data;
            }
            current = current.next;
            currentIndex++;
        }
    }

    // print the list data
    printList() {
        let current = this.head;

        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }

    // returns the linked list into an array
    toArray() {
        const llArray = [];
        let current = this.head;

        while (current) {
            llArray.push(current);
            current = current.next;
        }

        return llArray;
    }
}

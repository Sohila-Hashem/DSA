export class Queue {
    constructor() {
        this.queue = [];
        this.maxSize = 10;
    }

    // enqueue
    enqueue(value) {
        if (this.isFull()) {
            throw new Error("Queue is of max size");
        }
        this.queue.push(value);
    }

    // dequeue
    dequeue() {
        return this.queue.shift();
    }

    // get the peak/front element from the queue without removing it
    getPeak() {
        return this.queue[0];
    }

    // is the queue empty
    isEmpty() {
        return !!!this.queue.length;
    }

    // is the queue full
    isFull() {
        return this.queue.length === this.maxSize;
    }

    // print queue
    printQueue() {
        const queueLen = this.queue.length;
        for (let i = 0; i < queueLen; i++) {
            console.log(this.queue[i]);
        }
    }
}

class PriorityQueueEntry {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
}

export class PriorityQueue extends Queue {
    constructor() {
        super();
    }

    // here we set the priority default to
    // the array length + 1 to make priorities always start with 1
    enqueue(value, priority = this.queue.length + 1) {
        const pqEntry = new PriorityQueueEntry(value, priority);
        let added = false;

        if (this.isFull()) {
            throw new Error("Queue is of max size");
        }

        if (!priority) {
            this.queue.push(pqEntry);
            return;
        }

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].priority > priority) {
                this.queue.splice(i, 0, pqEntry);
                added = true;
                break;
            }
        }

        if (!added) {
            this.queue.push(pqEntry);
        }

        return;
    }
}

const queue = new Queue();
const priorityQueue = new PriorityQueue();

queue.enqueue(8);
queue.enqueue(1);
queue.enqueue(12);
queue.enqueue(9);

// console.log(queue.queue);

priorityQueue.enqueue(4);
priorityQueue.enqueue(5);
priorityQueue.enqueue(1);
priorityQueue.enqueue([7, 1], 1);
priorityQueue.enqueue([8]);
priorityQueue.enqueue([3, 4], 4);

console.log(priorityQueue.isEmpty());

console.log(priorityQueue.queue);

export class Queue {
    constructor(maxSize) {
        this.queue = [];
        this.maxSize = maxSize || 1000;
        this.front = -1;
        this.rear = -1;
    }

    getSize() {
        return this.rear - this.front + 1;
    }

    // enqueue
    enqueue(value) {
        if (value === undefined) throw new Error("value is defined");

        if (this.isFull()) {
            throw new Error("Queue is of max size");
        }

        if (this.front === -1) {
            this.front++;
        }

        this.queue[++this.rear] = value;
    }

    // dequeue
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }

        const tempFront = this.front;

        return this.queue[this.front++];
    }

    // get the peak/front element from the queue without removing it
    getPeak() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }

        return this.queue[this.front];
    }

    // is the queue empty
    isEmpty() {
        return this.front === -1 || this.front > this.rear;
    }

    // is the queue full
    isFull() {
        return this.getSize() === this.maxSize - 1;
    }

    // print queue
    printQueue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }

        const queueLen = this.queue.length;
        for (let i = this.front; i < queueLen; i++) {
            console.log(this.queue[i]);
        }
    }
}

const queue = new Queue();

queue.enqueue(8);
queue.enqueue(1);
queue.enqueue(12);
queue.enqueue(9);

console.log(queue.dequeue());

queue.printQueue();

console.log(queue.getPeak());

class PriorityQueueEntry {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
}

export class PriorityQueue extends Queue {
    #currentMaxPriority = 0;

    constructor() {
        super();
    }

    enqueue(value, priority) {
        if (priority === undefined) throw new Error("priority must be defined");

        if (priority < 0) throw new Error("underflow priority number");

        if (this.isFull()) {
            throw new Error("Queue is of max size");
        }

        const pqEntry = new PriorityQueueEntry(value, priority);

        if (priority >= this.#currentMaxPriority) {
            this.#currentMaxPriority = priority;
            super.enqueue(pqEntry);
            return;
        }

        for (let i = this.front; i < this.queue.length; i++) {
            if (this.queue[i].priority > priority) {
                this.queue.splice(i, 0, pqEntry);
                this.rear++;
                break;
            }
        }
        return;
    }
}

// const priorityQueue = new PriorityQueue();

// priorityQueue.enqueue([7, 1], 1);
// priorityQueue.enqueue([8], 0);
// priorityQueue.enqueue([3, 4], 4);
// priorityQueue.enqueue({ Name: "Amra" }, 1);
// priorityQueue.enqueue("Waffle", 100);
// priorityQueue.enqueue(true, 50);
// priorityQueue.enqueue("Sef", 80);
// priorityQueue.enqueue("Kiyle", 3);

// console.log(priorityQueue.isEmpty());

// priorityQueue.dequeue();
// priorityQueue.dequeue();

// priorityQueue.enqueue("Sohila", 2);

// console.log(priorityQueue.getPeak());

// console.log(priorityQueue.queue);
// console.log(priorityQueue.getSize());

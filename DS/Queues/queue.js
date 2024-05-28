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

	clearQueue() {
		this.queue = [];
		this.front = -1;
		this.rear = -1;
	}
}

// const queue = new Queue();

// queue.enqueue(8);
// queue.enqueue(1);
// queue.enqueue(12);
// queue.enqueue(9);

// console.log(queue.dequeue());

// queue.printQueue();

// console.log(queue.getPeak());

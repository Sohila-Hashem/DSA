import { Queue } from "../index.js";

export class PriorityQueueEntry {
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

	clearQueue() {
		super.clearQueue();
		this.#currentMaxPriority = 0;
	}

	enqueue(value, priority) {
		if (priority === undefined) throw new Error("priority must be defined");

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

import { LinkedList } from "../index.js";

export class StackLL {
	#stack;

	constructor() {
		this.#stack = new LinkedList();
	}

	get size() {
		return this.#stack.size;
	}

	getStack() {
		const linkedListData = [];
		let current = this.#stack.head;

		while (current) {
			linkedListData.push(current.data);
			current = current.next;
		}

		return linkedListData;
	}

	push(item) {
		if (!item) throw new Error("Expecting an argument of type any");

		this.#stack.insert(item);
	}

	pop() {
		if (!this.#stack.size) throw new Error("Stack Underflow");

		return this.#stack.remove().data;
	}

	peek() {
		if (!this.#stack.size) throw new Error("Stack Underflow");

		return this.#stack.tail.data;
	}

	isEmpty() {
		return !!!this.#stack.size;
	}
}

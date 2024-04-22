import { LinkedList } from "./linked-list.js";

export class Stack {
	#stack;
	#size;

	constructor(size) {
		this.#size = size || 10;
		this.#stack = [];
	}

	// returning a deep copy of the stack
	// to prevent any accidental mutation
	getStack() {
		return this.#stack;
	}

	get size() {
		return this.getStack().length;
	}

	push(item) {
		if (!item) throw new Error("Expecting an argument of type any");

		if (this.#stack.length >= this.#size) throw new Error("Stack Overflow");

		this.#stack.push(item);
	}

	pop() {
		if (!this.#stack.length) throw new Error("Stack Underflow");

		return this.#stack.pop();
	}

	peek() {
		if (!this.#stack.length) throw new Error("Stack is Empty");

		return this.#stack[this.#stack.length - 1];
	}

	isEmpty() {
		return !!!this.#stack.length;
	}
}

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

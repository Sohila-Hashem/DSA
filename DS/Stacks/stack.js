export class Stack {
	#stack;
	#size;

	constructor(size) {
		this.#size = size || 10;
		this.#stack = [];
	}

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

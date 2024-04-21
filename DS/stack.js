class Stack {
    #stack;
    #size;

    constructor(size) {
        this.#size = size || 10;
        this.#stack = [];
    }

    // returning a deep copy of the stack
    // to prevent any accidental mutation
    getStack() {
        return [...this.#stack];
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

// const stack = new Stack();

// is empty?
// console.log(stack.isEmpty());

// checking an underflow error
// stack.pop();

// checking an underflow error for
// getting a peek value
// stack.peek();

// push
// stack.push(1);
// stack.push(2);
// stack.push(3);
// stack.push(4);
// stack.push(5);

// is empty?
// console.log(stack.isEmpty());

// pop
// console.log(stack.pop());

// peak
// console.log(stack.peek());

// get stack
// console.log(stack.getStack());

// size
// console.log(stack.size);

// checking an overflow error
// stack.push(1);
// stack.push(2);
// stack.push(3);
// stack.push(4);
// stack.push(5);
// stack.push(5);
// stack.push(5);

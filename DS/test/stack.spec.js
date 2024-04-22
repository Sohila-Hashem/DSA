import assert from "assert";
import { Stack, StackLL } from "../stack.js";

describe("Stack", function () {
    describe("push", function () {
        it("should mutate the stack with the element added", function () {
            const stack = new Stack();
            stack.push(1);
            assert.strictEqual(stack.getStack()[0], 1);
        });

        it("should throw an Overflow error if the stack is full", function () {
            const stack = new Stack(3);
            stack.push(1);
            stack.push(2);
            stack.push(3);

            assert.throws(
                function () {
                    stack.push(4);
                },
                {
                    name: "Error",
                    message: "Stack Overflow",
                }
            );
        });
    });

    describe("getStack", function () {
        it("should return the stack", function () {
            const stack = new Stack();
            stack.push(1);
            assert.deepStrictEqual(stack.getStack(), [1]);
        });
    });

    describe("pop", function () {
        it("should return the last stack element", function () {
            const stack = new Stack();
            stack.push(1);
            assert.strictEqual(stack.pop(), 1);
        });

        it("should throw an error if the stack is empty", function () {
            const stack = new Stack();
            assert.throws(
                function () {
                    stack.pop();
                },
                {
                    name: "Error",
                    message: "Stack Underflow",
                }
            );
        });
    });

    describe("isEmpty", function () {
        it("should return true if the stack is empty", function () {
            const stack = new Stack();
            assert.strictEqual(stack.isEmpty(), true);
        });

        it("should return false if the stack is not empty", function () {
            const stack = new Stack();
            stack.push(1);
            assert.strictEqual(stack.isEmpty(), false);
        });
    });

    describe("peek", function () {
        it("should return the last element in the stack", function () {
            const stack = new Stack();
            stack.push(1);
            stack.push(2);
            assert.strictEqual(stack.peek(), 2);
        });

        it("should throw an error if the stack is empty", function () {
            const stack = new Stack();
            assert.throws(
                function () {
                    stack.peek();
                },
                {
                    name: "Error",
                    message: "Stack is Empty",
                }
            );
        });

        it("should not mutate the stack after invoking the method", function () {
            const stack = new Stack();
            stack.push(1);
            stack.push(2);

            const stackCopy1 = [...stack.getStack()];

            stack.peek();

            const stackCopy2 = [...stack.getStack()];

            assert.deepStrictEqual(stackCopy1, stackCopy2);
        });
    });

    describe("size property", function () {
        it("should return the size of the stack", function () {
            const stack = new Stack();
            stack.push(1);

            assert.strictEqual(stack.size, 1);
        });
    });
});

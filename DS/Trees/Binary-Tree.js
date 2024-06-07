import { TreeNode, Stack, Queue } from "../index.js";

// TRAVERSING
export const bfs = (root) => {
	if (root === null) return [];

	const result = [];
	const queue = new Queue();

	queue.enqueue(root);

	while (!queue.isEmpty()) {
		const currentNode = queue.dequeue();

		result.push(currentNode.value);

		if (currentNode.left !== null) queue.enqueue(currentNode.left);
		if (currentNode.right !== null) queue.enqueue(currentNode.right);
	}

	return result;
};

export const dfs = (root) => {
	if (root === null) return [];

	const result = [];
	const stack = new Stack(20);

	stack.push(root);

	while (!stack.isEmpty()) {
		const currentNode = stack.pop();
		result.push(currentNode.value);

		if (currentNode.right !== null) stack.push(currentNode.right);
		if (currentNode.left !== null) stack.push(currentNode.left);
	}

	return result;
};

// DFS -> root, left, right
export const preOrderTraversal = (root) => {
	if (root === null) return [];

	const leftChildren = preOrderTraversal(root.left);
	const rightChildren = preOrderTraversal(root.right);

	return [root.value, ...leftChildren, ...rightChildren];
};

// DFS -> left, root, right
export const inOrderTraversal = (root) => {
	if (root === null) return [];

	const left = inOrderTraversal(root.left);
	const right = inOrderTraversal(root.right);

	return [...left, root.value, ...right];
};

// DFS -> left, right, root
export function postOrderTraversal(root) {
	if (root === null) return [];

	const left = postOrderTraversal(root.left);
	const right = postOrderTraversal(root.right);

	return [...left, ...right, root.value];
}

// INCLUDES?
export const includesBFS = (root, target) => {
	if (root === null) return false;

	const queue = new Queue();

	queue.enqueue(root);

	while (!queue.isEmpty()) {
		const currentNode = queue.dequeue();

		if (currentNode.value === target) return true;

		if (currentNode.left !== null) queue.enqueue(currentNode.left);
		if (currentNode.right !== null) queue.enqueue(currentNode.right);
	}

	return false;
};

export const includesDFSRecursive = (root, target) => {
	if (root === null) return false;
	if (root.value === target) return true;

	return includesDFSRecursive(root.left, target) || includesDFSRecursive(root.right, target);
};

// SUM TREE
export const sumDFSRecursive = (root) => {
	if (root === null) return 0;

	return root.value + sumDFSRecursive(root.left) + sumDFSRecursive(root.right);
};

export const sumDFS = (root) => {
	const stack = new Stack(20);
	let sum = 0;

	stack.push(root);

	while (!stack.isEmpty()) {
		const currentNode = stack.pop();
		sum += currentNode.value;

		if (currentNode.right !== null) stack.push(currentNode.right);
		if (currentNode.left !== null) stack.push(currentNode.left);
	}

	return sum;
};

// MIN NODE
export const minBFS = (root) => {
	const queue = new Queue(20);
	let min = Infinity;

	queue.enqueue(root);

	while (!queue.isEmpty()) {
		const currentNode = queue.dequeue();

		console.log(currentNode.value);

		if (currentNode.value < min) min = currentNode.value;

		if (currentNode.left !== null) queue.enqueue(currentNode.left);
		if (currentNode.right !== null) queue.enqueue(currentNode.right);
	}

	return min;
};

export const minDFS = (root) => {
	const stack = new Stack(20);
	let min = Infinity;

	stack.push(root);

	while (!stack.isEmpty()) {
		const currentNode = stack.pop();
		if (currentNode.value < min) min = currentNode.value;

		if (currentNode.right !== null) stack.push(currentNode.right);
		if (currentNode.left !== null) stack.push(currentNode.left);
	}

	return min;
};

export const minDFSRecursive = (root) => {
	if (root === null) return Infinity;

	const minLeft = minDFSRecursive(root.left);
	const minRight = minDFSRecursive(root.right);

	const min = Math.min(root.value, minRight, minLeft);

	return min;
};

export const maxRootToLeafPath = (root) => {
	if (root === null) return -Infinity;
	if (root.left === null && root.right === null) return root.value;

	const maxChildPath = Math.max(maxRootToLeafPath(root.left), maxRootToLeafPath(root.right));

	return root.value + maxChildPath;
};

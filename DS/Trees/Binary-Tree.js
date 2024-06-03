import { TreeNode, Stack, Queue } from "../index.js";

// const a = new TreeNode("a");
// const b = new TreeNode("b");
// const c = new TreeNode("c");
// const d = new TreeNode("d");
// const e = new TreeNode("e");
// const f = new TreeNode("f");

const a = new TreeNode(5);
const b = new TreeNode(11);
const c = new TreeNode(3);
const d = new TreeNode(4);
const e = new TreeNode(2);
const f = new TreeNode(1);

a.left = b;
a.right = c;
b.left = d;
b.right = e;
c.right = f;

// TRAVERSING
const dfs = (root) => {
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

// console.log(dfs(a));

const dfsRecursive = (root) => {
	if (root === null) return [];

	const leftChildren = dfsRecursive(root.left);
	leftChildren;
	const rightChildren = dfsRecursive(root.right);
	rightChildren;

	return [root.value, ...leftChildren, ...rightChildren];
};

// console.log(dfsRecursive(a));

const bfs = (root) => {
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

// console.log(bfs(a));

// INCLUDES?
const includesBFS = (root, target) => {
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

// console.log(includesBFS(a, "n"));
// console.log(includesBFS(a, "e"));

const includesDFSRecursive = (root, target) => {
	if (root === null) return false;
	if (root.value === target) return true;

	return includesDFSRecursive(root.left, target) || includesDFSRecursive(root.right, target);
};

// console.log(includesDFSRecursive(a, "n"));
// console.log(includesDFSRecursive(a, "e"));

// SUM TREE
const sumDFSRecursive = (root) => {
	if (root === null) return 0;

	return root.value + sumDFSRecursive(root.left) + sumDFSRecursive(root.right);
};

// console.log(sumDFSRecursive(a));

const sumDFS = (root) => {
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

// console.log(sumDFS(a));

// MIN NODE
const minBFS = (root) => {
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

// console.log(minBFS(a));

const minDFS = (root) => {
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

// console.log(minDFS(a));

const minDFSRecursive = (root) => {
	if (root === null) return Infinity;

	const minLeft = minDFSRecursive(root.left);
	const minRight = minDFSRecursive(root.right);

	const min = Math.min(root.value, minRight, minLeft);

	return min;
};

// console.log(minDFSRecursive(a));

const maxRootToLeafPath = (root) => {
	if (root === null) return -Infinity;
	if (root.left === null && root.right === null) return root.value;

	const maxChildPath = Math.max(maxRootToLeafPath(root.left), maxRootToLeafPath(root.right));

	return root.value + maxChildPath;
};

// console.log(maxRootToLeafPath(a));

//  	   a
// 		/    \
//    b       c
//   / \       \
//  d   e       f

//  	    5
// 		/      \
//    11        3
//   /  \        \
//  4    2        1

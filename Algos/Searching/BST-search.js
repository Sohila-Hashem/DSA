import { BST } from "../../DS/index.js";

export const BSTSearch = (root, target) => {
	if (root === null) return false;

	if (target > root.value) {
		return BSTSearch(root.right, target);
	} else if (target < root.value) {
		return BSTSearch(root.left, target);
	}

	return true;
};

const bst = new BST();
const nodes = [5, 11, 3, 4, 2, 1, 10, 14, 20, 6, 13];

nodes.forEach((node) => {
	bst.insert(node);
});

// console.log(BSTSearch(bst.root, 20));
// console.log(BSTSearch(bst.root, 22));

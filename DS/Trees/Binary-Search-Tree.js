import { TreeNode } from "../index.js";

export class BST {
	constructor(root = null) {
		this.root = new TreeNode(root);
	}

	insert(nodeValue) {
		const newNode = new TreeNode(nodeValue);
		if (this.root.value === null) {
			this.root = newNode;
			return;
		}

		let currentNode = this.root;

		while (true) {
			if (newNode.value < currentNode.value) {
				if (currentNode.left === null) {
					currentNode.left = newNode;
					break;
				}

				currentNode = currentNode.left;
				continue;
			} else {
				if (currentNode.right === null) {
					currentNode.right = newNode;
					break;
				}

				currentNode = currentNode.right;
				continue;
			}
		}
	}

	remove(value) {
		this.root = this.#removeNode(this.root, value);
	}

	#removeNode(node, value) {
		if (node === null) return null;

		if (value < node.value) {
			node.left = this.#removeNode(node.left, value);
			return node;
		} else if (value > node.value) {
			node.right = this.#removeNode(node.right, value);
			return node;
		}

		// if node has one child, either to the left or the right
		if (node.right === null) {
			return node.left;
		} else if (node.left === null) {
			return node.right;
		}

		// in case the node has two children, find the min In-Order successor
		const min = this.#minInOrderSuccessor(node.right);
		node.value = min.value;

		// recursively remove the successor after then.
		node.right = this.#removeNode(node.right, min.value);
		return node;
	}

	#minInOrderSuccessor(node) {
		let currentNode = node;

		if (currentNode) {
			while (currentNode.left !== null) {
				currentNode = currentNode.left;
			}
		}

		return currentNode;
	}
}

// const BSTNumeric = new BST();
// const nodes = [5, 11, 3, 4, 2, 1, 10, 14, 20, 6, 13];

// nodes.forEach((node) => {
// 	BSTNumeric.insert(node);
// });

// const BSTNumericRoot = BSTNumeric.root;

// BSTNumeric.remove(11);

// console.log(JSON.stringify(BSTNumericRoot, 0, 2));

/*            5
        /           \
       3            11
     /  \         /   \
    2    4      10    14
  /	    /	         /  \
 1	   6	       13    20
 */

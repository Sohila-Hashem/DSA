import { Queue } from "./queue.js";
class GraphMatrixUtils {
	static getNodeIndex(node, nodeList) {
		if (!node) throw new Error("expected an argument of node");

		return nodeList[node];
	}

	static checkExistenceOfNodes(source, destination, nodeList) {
		if (!source || !destination) {
			throw new Error("source and destination must be defined");
		}

		const sourceIndex = this.getNodeIndex(source, nodeList);
		const destinationIndex = this.getNodeIndex(destination, nodeList);

		if (sourceIndex === undefined || destinationIndex === undefined) {
			throw new Error(
				`Either node ${source} or ${destination} is not defined`
			);
		}

		return [sourceIndex, destinationIndex];
	}
}

export class GraphMatrix {
	currentNodeIndex;

	constructor(size = 10) {
		this.size = size;
		this.nodeList = {};
		this.matrix = [];
		this.currentNodeIndex = 0;

		for (let i = 0; i < size; i++) {
			this.matrix.push(new Array(size).fill(0));
		}
	}

	getNode(node) {
		if (!node) throw new Error("expected an argument of node");

		return this.matrix[this.nodeList[node]];
	}

	getNodeList() {
		return Object.entries(this.nodeList);
	}

	addNode(node) {
		if (this.nodeList[node]) return;

		if (this.currentNodeIndex > this.size)
			throw new Error("Graph Overflow");

		this.nodeList[node] = this.currentNodeIndex++;
	}

	removeNode(node) {
		const nodeIndex = GraphMatrixUtils.getNodeIndex(node, this.nodeList);

		for (let i = 0; i < this.matrix.length; i++) {
			this.matrix[i].splice(nodeIndex, 1);
			this.matrix[i].push(0);
		}

		for (let node in this.nodeList) {
			const nodeCurrentIndex = this.nodeList[node];

			if (nodeCurrentIndex > nodeIndex) {
				this.nodeList[node] -= 1;
			}
		}

		this.matrix.splice(nodeIndex, 1);

		this.matrix.push(new Array(10).fill(0));

		this.currentNodeIndex--;
		delete this.nodeList[node];
	}

	// O(V^2)
	bfs(start, compareCB) {
		const queue = new Queue();
		const result = [];
		const visited = {};

		if (GraphMatrixUtils.getNodeIndex(start, this.nodeList) === undefined)
			throw new Error(`Node ${start} does not exist in the graph`);

		queue.enqueue(start);

		while (!queue.isEmpty()) {
			const currentNode = queue.dequeue();

			if (!visited[currentNode]) {
				const currentNodeNeighbors = this.getNode(currentNode);
				const nodeListEntries = this.getNodeList();

				for (let i = 0; i < currentNodeNeighbors.length; i++) {
					if (currentNodeNeighbors[i]) {
						queue.enqueue(nodeListEntries[i][0]);
					}
				}

				if (compareCB && compareCB(currentNode)) {
					result.push(currentNode);
				} else if (!compareCB) {
					result.push(currentNode);
				}

				visited[currentNode] = true;
			}
		}

		return result;
	}

	printMatrix() {
		const nodes = Object.keys(this.nodeList);
		console.log(nodes);

		for (let i = 0; i < this.matrix.length; i++) {
			console.log(nodes[i], this.matrix[i]);
		}
	}
}

export class GraphMatrixDirect extends GraphMatrix {
	constructor(size) {
		super(size);
	}

	addEdge(source, destination, weight = 1) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		this.matrix[sourceNodeIndex][destinationNodeIndex] = weight;
	}

	removeEdge(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		if (!this.isNeighbors(source, destination)) {
			throw new Error(
				`${source} and ${destination} nodes are not neighbors`
			);
		}

		this.matrix[sourceNodeIndex][destinationNodeIndex] = 0;
	}

	isNeighbors(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		return !!this.matrix[sourceNodeIndex][destinationNodeIndex];
	}
}

export class GraphMatrixIndirect extends GraphMatrix {
	constructor(size) {
		super(size);
	}

	addEdge(source, destination, weight = 1) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		this.matrix[sourceNodeIndex][destinationNodeIndex] = weight;
		this.matrix[destinationNodeIndex][sourceNodeIndex] = weight;
	}

	removeEdge(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		if (!this.isNeighbors(source, destination)) {
			throw new Error(
				`${source} and ${destination} nodes are not neighbors`
			);
		}

		this.matrix[sourceNodeIndex][destinationNodeIndex] = 0;
		this.matrix[destinationNodeIndex][sourceNodeIndex] = 0;
	}

	isNeighbors(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.nodeList
			);

		const isDestFoundInSrc =
			!!this.matrix[sourceNodeIndex][destinationNodeIndex];
		const isSrcFoundInDest =
			!!this.matrix[destinationNodeIndex][sourceNodeIndex];

		return isDestFoundInSrc && isSrcFoundInDest;
	}
}

// const graphMatrixDirect = new GraphMatrixDirect();
// const graphMatrixIndirect = new GraphMatrixIndirect();

// graphMatrixIndirect.addNode("A");
// graphMatrixIndirect.addNode("B");
// graphMatrixIndirect.addNode("C");
// graphMatrixIndirect.addNode("D");
// graphMatrixIndirect.addNode("E");
// graphMatrixIndirect.addNode("F");
// graphMatrixIndirect.addNode("G");
// graphMatrixIndirect.addNode("N");

// graphMatrixIndirect.addEdge("A", "B");
// graphMatrixIndirect.addEdge("A", "C", 10);
// graphMatrixIndirect.addEdge("C", "B", 12);
// graphMatrixIndirect.addEdge("C", "F", 14);
// graphMatrixIndirect.addEdge("C", "N", 16);
// graphMatrixIndirect.addEdge("N", "F");
// graphMatrixIndirect.addEdge("B", "D");
// graphMatrixIndirect.addEdge("F", "E");
// graphMatrixIndirect.addEdge("D", "G");
// graphMatrixIndirect.addEdge("E", "G", 7);

// const compareCB = (node) => {
// 	const nodeName = node + Math.floor(Math.random() * 15);
// 	if (nodeName.slice(1) % 2 === 0) {
// 		return true;
// 	}
// 	return false;
// };

// console.log(graphMatrixIndirect.bfs("A"));
// console.log(graphMatrixIndirect.bfs("C", compareCB));

// console.log(graphMatrixIndirect.getNode("C"));

// graphMatrixIndirect.removeNode("C");

// graphMatrixIndirect.addNode("I");

// graphMatrixIndirect.addEdge("I", "B");

// console.log(graphMatrixIndirect.isNeighbors("N", "F"));
// console.log(graphMatrixIndirect.isNeighbors("F", "N"));
// console.log(graphMatrixIndirect.isNeighbors("E", "G"));
// console.log(graphMatrixIndirect.isNeighbors("G", "E"));
// console.log(graphMatrixIndirect.isNeighbors("I", "E"));

// graphMatrixIndirect.printMatrix();
// console.log(graphMatrixIndirect.getNodeList());

// // testing errors when nodes are not neighbors
// graphMatrixIndirect.removeEdge("B", "A"); // for Indirect graphs
// graphMatrixIndirect.removeEdge("I", "A"); // for direct graphs

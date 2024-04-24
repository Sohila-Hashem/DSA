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

	getNodeList() {
		return Object.entries(this.nodeList);
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

	getNode(node) {
		if (!node) throw new Error("expected an argument of node");

		return this.matrix[this.nodeList[node]];
	}

	addNode(node) {
		if (this.nodeList[node]) return;

		if (this.currentNodeIndex > this.size)
			throw new Error("Graph Overflow");

		this.nodeList[node] = this.currentNodeIndex++;
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

		const isDestFoundInSrc =
			!!this.matrix[sourceNodeIndex][destinationNodeIndex];

		if (!isDestFoundInSrc) {
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

// const graphMatrixDirect = new GraphMatrixDirect();

// graphMatrixDirect.addNode("A");
// graphMatrixDirect.addNode("B");
// graphMatrixDirect.addNode("C");
// graphMatrixDirect.addNode("D");
// graphMatrixDirect.addNode("E");
// graphMatrixDirect.addNode("F");
// graphMatrixDirect.addNode("G");
// graphMatrixDirect.addNode("N");

// graphMatrixDirect.addEdge("A", "B");
// graphMatrixDirect.addEdge("A", "C", 10);
// graphMatrixDirect.addEdge("C", "B", 12);
// graphMatrixDirect.addEdge("C", "F", 14);
// graphMatrixDirect.addEdge("C", "N", 16);
// graphMatrixDirect.addEdge("N", "F");
// graphMatrixDirect.addEdge("B", "D");
// graphMatrixDirect.addEdge("F", "E");
// graphMatrixDirect.addEdge("D", "G");
// graphMatrixDirect.addEdge("E", "G", 7);

// const compareCB = (node) => {
// 	const nodeName = node + Math.floor(Math.random() * 15);
// 	if (nodeName.slice(1) % 2 === 0) {
// 		return true;
// 	}
// 	return false;
// };

// console.log(graphMatrixDirect.bfs("A"));
// console.log(graphMatrixDirect.bfs("C", compareCB));

// console.log(graphMatrixDirect.getNode("C"));

// graphMatrixDirect.removeNode("C");

// graphMatrixDirect.addNode("I");

// graphMatrixDirect.addEdge("I", "B");

// console.log(graphMatrixDirect.isNeighbors("N", "F"));
// console.log(graphMatrixDirect.isNeighbors("F", "N"));
// console.log(graphMatrixDirect.isNeighbors("E", "G"));
// console.log(graphMatrixDirect.isNeighbors("G", "E"));

// console.log(graphMatrixDirect.printMatrix());
// console.log(graphMatrixDirect.getNodeList());

// // testing errors when nodes are not neighbors
// graphMatrixDirect.removeEdge("B", "A");

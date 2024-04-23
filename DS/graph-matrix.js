class GraphMatrixUtils {
	static getNodeIndex(node, nodeList) {
		if (!node) throw new Error("expected an argument of node");

		return nodeList[node];
	}

	// checks if two nodes already exists or not
	static checkExistenceOfNodes(source, destination, nodeList) {
		if (!source || !destination) {
			throw new Error("source and destination must be defined");
		}

		const sourceIndex = this.getNodeIndex(source, nodeList);
		const destinationIndex = this.getNodeIndex(destination, nodeList);

		if (sourceIndex === undefined || destinationIndex === undefined) {
			throw new Error("either source or destination does not exist");
		}

		return [sourceIndex, destinationIndex];
	}
}

export class GraphMatrix {
	#size;
	#nodeList;
	#matrix;
	#currentNodeIndex;

	constructor(size = 10) {
		this.#size = size;
		this.#nodeList = {};
		this.#matrix = [];
		this.#currentNodeIndex = 0;

		for (let i = 0; i < size; i++) {
			this.#matrix.push(new Array(size).fill(0));
		}
	}

	getNodeList() {
		return Object.entries(this.#nodeList);
	}

	// return a deep copy of the matrix
	// to mitigate mistaken reassignments
	getMatrix() {
		return [...this.#matrix];
	}

	getNode(node) {
		if (!node) throw new Error("expected an argument of node");

		return this.#matrix[this.#nodeList[node]];
	}

	addNode(node) {
		if (this.#nodeList[node])
			throw new Error(`node: ${node} already exists`);

		if (this.#currentNodeIndex > this.#size)
			throw new Error("the graph is in full capacity");

		this.#nodeList[node] = this.#currentNodeIndex++;
	}

	addEdge(source, destination, options = { isDirected: false, weight: 1 }) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.#nodeList
			);

		if (!options.isDirected) {
			this.#matrix[destinationNodeIndex][sourceNodeIndex] =
				options.weight || 1;
		}

		this.#matrix[sourceNodeIndex][destinationNodeIndex] =
			options.weight || 1;
	}

	removeEdge(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.#nodeList
			);

		const isDestFoundInSrc =
			!!this.#matrix[sourceNodeIndex][destinationNodeIndex];
		const isSrcFoundInDest =
			!!this.#matrix[destinationNodeIndex][sourceNodeIndex];

		if (!isDestFoundInSrc) {
			throw new Error(
				`${source} and ${destination} nodes are not connected`
			);
		}

		if (isSrcFoundInDest && isDestFoundInSrc) {
			this.#matrix[destinationNodeIndex][sourceNodeIndex] = 0;
		}

		this.#matrix[sourceNodeIndex][destinationNodeIndex] = 0;
	}

	removeNode(node) {
		const nodeIndex = GraphMatrixUtils.getNodeIndex(node, this.#nodeList);

		for (let i = 0; i < this.#matrix.length; i++) {
			this.#matrix[i].splice(nodeIndex, 1);
			this.#matrix[i].push(0);
		}

		for (let node in this.#nodeList) {
			const nodeCurrentIndex = this.#nodeList[node];

			if (nodeCurrentIndex > nodeIndex) {
				this.#nodeList[node] -= 1;
			}
		}

		this.#matrix.splice(nodeIndex, 1);

		this.#matrix.push(new Array(10).fill(0));

		this.#currentNodeIndex--;
		delete this.#nodeList[node];
	}

	isNeighbors(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] =
			GraphMatrixUtils.checkExistenceOfNodes(
				source,
				destination,
				this.#nodeList
			);

		const isDestFoundInSrc =
			!!this.#matrix[sourceNodeIndex][destinationNodeIndex];
		const isSrcFoundInDest =
			!!this.#matrix[destinationNodeIndex][sourceNodeIndex];

		if (isDestFoundInSrc || (isDestFoundInSrc && isSrcFoundInDest))
			return true;

		return false;
	}

	// O(V^2)
	bfs(start, compareCB) {
		const queue = new Queue();
		const result = [];
		const visited = {};

		if (this.#nodeList[start] === undefined)
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
}

// const graphMatrix = new GraphMatrix();
// const isDirected = true;

// graphMatrix.addNode("A");
// graphMatrix.addNode("B");
// graphMatrix.addNode("C");
// graphMatrix.addNode("D");
// graphMatrix.addNode("E");
// graphMatrix.addNode("F");
// graphMatrix.addNode("G");
// graphMatrix.addNode("N");

// graphMatrix.addEdge("A", "B");
// graphMatrix.addEdge("A", "C", { isDirected, weight: 10 });
// graphMatrix.addEdge("C", "B", { isDirected, weight: 12 });
// graphMatrix.addEdge("C", "F", { isDirected, weight: 14 });
// graphMatrix.addEdge("C", "N", { isDirected, weight: 16 });
// graphMatrix.addEdge("N", "F", { isDirected });
// graphMatrix.addEdge("B", "D", { isDirected });
// graphMatrix.addEdge("F", "E", { isDirected });
// graphMatrix.addEdge("D", "G", { isDirected });
// graphMatrix.addEdge("E", "G", { weight: 7 });

// console.log(graphMatrix.getNode("C"));

// graphMatrix.removeNode("C");

// graphMatrix.addNode("I");

// graphMatrix.addEdge("I", "B");

// graphMatrix.removeEdge("B", "A");

// console.log(graphMatrix.isNeighbors("N", "F"));
// console.log(graphMatrix.isNeighbors("F", "N"));
// console.log(graphMatrix.isNeighbors("E", "G"));
// console.log(graphMatrix.isNeighbors("G", "E"));

// console.log(graphMatrix.getMatrix());
// console.log(graphMatrix.getNodeList());

// const compareCB = (node) => {
//     const nodeName = node + Math.floor(Math.random() * 15);
//     if (nodeName.slice(1) % 2 === 0) {
//         return true;
//     }
//     return false;
// };

// console.log(graphMatrix.bfs("A"));
// console.log(graphMatrix.bfs("C", compareCB));

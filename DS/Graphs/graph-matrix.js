import { Queue, PriorityQueue } from "../index.js";

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
			throw new Error(`Either node ${source} or ${destination} is not defined`);
		}

		return [sourceIndex, destinationIndex];
	}
}

export default class GraphMatrix {
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

	getNodeListEntries() {
		return Object.entries(this.nodeList);
	}

	addNode(node) {
		if (this.nodeList[node]) return;

		if (this.currentNodeIndex > this.size) throw new Error("Graph Overflow");

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
		const visited = new Set();
		const result = [];

		if (this.nodeList[start] === undefined)
			throw new Error(`${start} is not a defined node in the graph!`);

		queue.enqueue(start);

		while (!queue.isEmpty()) {
			const currentNode = queue.dequeue();

			if (!visited.has(currentNode)) {
				visited.add(currentNode);

				const currentNodeNeighbors = this.getNode(currentNode);
				const nodeListEntries = this.getNodeListEntries();

				currentNodeNeighbors.forEach((neighborWeight, index) => {
					if (neighborWeight) {
						queue.enqueue(nodeListEntries[index][0]);
					}
				});

				if (compareCB && !compareCB(currentNode)) {
					continue;
				}

				result.push(currentNode);
			}
		}

		return result;
	}

	dfs(currentNode, visited = new Set(), result = []) {
		if (this.nodeList[currentNode] === undefined)
			throw new Error(`Node ${start} does not exist in the graph`);

		visited.add(currentNode);
		result.push(currentNode);

		const nodeListEntries = this.getNodeListEntries();
		const currentNodeNeighbors = this.getNode(currentNode);

		currentNodeNeighbors.forEach((neighborWeight, index) => {
			if (neighborWeight) {
				const neighborName = nodeListEntries[index][0];

				if (!visited.has(neighborName)) {
					this.dfs(neighborName, visited, result);
				}
			}
		});

		return result;
	}

	shortestPath(start) {
		if (!this.getNode(start)) throw new Error(`${start} is not a defined node in the graph`);

		const paths = {};
		const visited = new Set();
		const distances = {};
		const PQueue = new PriorityQueue();
		const nodes = Object.keys(this.nodeList);

		nodes.forEach((node) => {
			distances[node] = Infinity;
			paths[node] = [];
		});

		distances[start] = 0;
		PQueue.enqueue(start, 0);

		while (!PQueue.isEmpty()) {
			const { value: currentNode } = PQueue.dequeue();

			if (!visited.has(currentNode)) {
				visited.add(currentNode);
				const currentNodeNeighbors = this.getNode(currentNode);

				currentNodeNeighbors.forEach((neighborWeight, index) => {
					if (neighborWeight) {
						const neighborNodeName = nodes[index];
						const calculatedNeighborDistance = distances[currentNode] + neighborWeight;
						const currentNeighborDistance = distances[neighborNodeName];

						if (calculatedNeighborDistance < currentNeighborDistance) {
							distances[neighborNodeName] = calculatedNeighborDistance;
							paths[neighborNodeName] = paths[currentNode].concat(currentNode);
							PQueue.enqueue(neighborNodeName, neighborWeight);
						}
					}
				});
			}
		}

		return { distances, paths };
	}

	bellmanFord(start) {
		if (!this.getNode(start)) throw new Error(`${start} is not a defined node in the graph`);

		const nodes = Object.keys(this.nodeList);
		const distances = {};
		const parents = {};
		const cycles = [];
		let isUpdated = false;

		nodes.forEach((node) => {
			distances[node] = Infinity;
		});

		distances[start] = 0;

		// relaxing edges between node V-1 times
		for (let i = 0; i < nodes.length - 1; i++) {
			if (!isUpdated && i > 2) break;
			nodes.forEach((node) => {
				if (distances[node] === Infinity) return;
				const currentNodeNeighbors = this.getNode(node);
				currentNodeNeighbors.forEach((neighborWeight, index) => {
					if (neighborWeight) {
						const neighborName = nodes[index];
						const currentNeighborDistance = distances[neighborName];
						const calculatedNeighborDistance = distances[node] + neighborWeight;

						if (calculatedNeighborDistance < currentNeighborDistance) {
							distances[neighborName] = calculatedNeighborDistance;
							parents[neighborName] = node;
							isUpdated = true;
							return;
						}

						isUpdated = false;
					}
				});
			});
		}

		// detecting negative cycles and backtrack the track if found
		nodes.forEach((node) => {
			const currentNodeNeighbors = this.getNode(node);
			currentNodeNeighbors.forEach((neighborWeight, index) => {
				if (neighborWeight) {
					const neighborName = nodes[index];
					const currentNeighborDistance = distances[neighborName];
					const calculatedNeighborDistance = distances[node] + neighborWeight;

					if (calculatedNeighborDistance < currentNeighborDistance) {
						const cycleTrack = [node, neighborName];
						let parent = parents[node];

						while (parent !== node && !cycleTrack.includes(parent)) {
							cycleTrack.unshift(parent);
							parent = parents[parent];
						}

						cycles.push(cycleTrack);
					}
				}
			});
		});

		console.log(cycles);
		return { distances, parents, cycles };
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
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
			source,
			destination,
			this.nodeList
		);

		this.matrix[sourceNodeIndex][destinationNodeIndex] = weight;
	}

	removeEdge(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
			source,
			destination,
			this.nodeList
		);

		if (!this.isNeighbors(source, destination)) {
			throw new Error(`${source} and ${destination} nodes are not neighbors`);
		}

		this.matrix[sourceNodeIndex][destinationNodeIndex] = 0;
	}

	isNeighbors(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
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
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
			source,
			destination,
			this.nodeList
		);

		this.matrix[sourceNodeIndex][destinationNodeIndex] = weight;
		this.matrix[destinationNodeIndex][sourceNodeIndex] = weight;
	}

	removeEdge(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
			source,
			destination,
			this.nodeList
		);

		if (!this.isNeighbors(source, destination)) {
			throw new Error(`${source} and ${destination} nodes are not neighbors`);
		}

		this.matrix[sourceNodeIndex][destinationNodeIndex] = 0;
		this.matrix[destinationNodeIndex][sourceNodeIndex] = 0;
	}

	isNeighbors(source, destination) {
		const [sourceNodeIndex, destinationNodeIndex] = GraphMatrixUtils.checkExistenceOfNodes(
			source,
			destination,
			this.nodeList
		);

		const isDestFoundInSrc = !!this.matrix[sourceNodeIndex][destinationNodeIndex];
		const isSrcFoundInDest = !!this.matrix[destinationNodeIndex][sourceNodeIndex];

		return isDestFoundInSrc && isSrcFoundInDest;
	}
}

// const graphMatrixDirect = new GraphMatrixDirect();
// const graphMatrixIndirect = new GraphMatrixIndirect();

// graphMatrixDirect.addNode("A");
// graphMatrixDirect.addNode("B");
// graphMatrixDirect.addNode("C");
// graphMatrixDirect.addNode("D");
// graphMatrixDirect.addNode("E");
// graphMatrixDirect.addNode("F");
// graphMatrixDirect.addNode("G");
// graphMatrixDirect.addNode("N");

// graphMatrixDirect.addEdge("A", "B", 12);
// graphMatrixDirect.addEdge("A", "C", 2);
// graphMatrixDirect.addEdge("C", "B", 9);
// graphMatrixDirect.addEdge("C", "F", 14);
// graphMatrixDirect.addEdge("C", "N", 16);
// graphMatrixDirect.addEdge("N", "F", 5);
// graphMatrixDirect.addEdge("B", "D", -7);
// graphMatrixDirect.addEdge("F", "E", 15);
// graphMatrixDirect.addEdge("D", "G", 8);
// graphMatrixDirect.addEdge("E", "G", 7);

// const outputBMF = graphMatrixDirect.bellmanFord("A");
// console.log(outputBMF);

// const { distances, paths } = graphMatrixIndirect.shortestPath("C");
// console.log(distances);
// console.log(paths);

// const outputDFS = graphMatrixDirect.dfs("A");
// console.log(outputDFS);

// // this is just a mock cb to try it with the main bfs algorithm
// const compareCB = (node) => {
// 	const nodeName = node + Math.floor(Math.random() * 15);
// 	if (nodeName.slice(1) % 2 === 0) {
// 		return true;
// 	}
// 	return false;
// };

// console.log(graphMatrixDirect.bfs("A"));
// console.log(graphMatrixDirect.bfs("C", compareCB));

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
// console.log(graphMatrixIndirect.getNodeListEntries());

// // testing errors when nodes are not neighbors
// graphMatrixIndirect.removeEdge("B", "A"); // for Indirect graphs
// graphMatrixIndirect.removeEdge("I", "A"); // for direct graphs

import HashTable from "./hash-table.js";
import { Queue, PriorityQueue } from "./queue.js";

class GraphListUtils {
	static getEdgeNodes(source, destination, graph) {
		if (!source || !destination) {
			throw new Error("source and destination nodes name must be defined");
		}

		const sourceNode = graph.getKey(source);
		const destinationNode = graph.getKey(destination);

		if (!sourceNode || !destinationNode)
			throw new Error(`Either ${source} or ${destination} nodes are not defined`);

		return [sourceNode, destinationNode];
	}
}

export default class GraphList {
	constructor(size) {
		this.graph = new HashTable(size);
	}

	get nodes() {
		return this.getGraph().map((node) => node[0][0]);
	}

	getGraph() {
		return this.graph.map;
	}

	getNodeNeighbors(node) {
		if (!node) throw new Error("node name must be provided");
		return this.graph.getKey(node);
	}

	removeNode(node) {
		const graph = this.getGraph();

		for (let i = 0; i < graph.length; i++) {
			const graphEntry = graph[i];

			graphEntry.forEach((graphNode) => {
				const nodeNeighbors = graphNode[1];

				this.graph.setKey(
					graphNode[0],
					nodeNeighbors.filter((neighbor) => neighbor[0] !== node)
				);
			});
		}

		this.graph.removeKey(node);
		return true;
	}

	bfs(start, compareCB) {
		if (!this.getNodeNeighbors(start))
			throw new Error(`${start} is not a defined node in the graph`);

		const queue = new Queue();
		const visited = new Set();
		const result = [];

		queue.enqueue(start);

		while (!queue.isEmpty()) {
			const currentNode = queue.dequeue();

			if (!visited.has(currentNode)) {
				visited.add(currentNode);

				const currentNodeNeighbors = this.getNodeNeighbors(currentNode);

				currentNodeNeighbors.forEach((neighbor) => {
					const [neighborName] = neighbor;
					queue.enqueue(neighborName);
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
		if (!this.getNodeNeighbors(currentNode))
			throw new Error(`${currentNode} is not a defined node in the graph`);

		visited.add(currentNode);
		result.push(currentNode);

		const currentNodeNeighbors = this.getNodeNeighbors(currentNode);

		currentNodeNeighbors.forEach((node) => {
			const [neighborName] = node;
			if (!visited.has(neighborName)) {
				this.dfs(neighborName, visited, result);
			}
		});

		return result;

		/* 
		Visual representation of the call stack
			book -> [Rare-LP, Poster]
			Rare-LP -> [Bass-Guitar]
			Bass-Guitar -> [Piano]
			Piano -> []
			Rare-LP -> [Drum-Set]
			Drum-Set -> [Piano]
			Rare-LP -> [Poster]
			Poster -> [Bass-Guitar]
			Poster -> [Drum-Set]
			Book -> [Poster]
		 */
	}

	// Dijkstra algorithm
	shortestPath(start, target) {
		if (!this.getNodeNeighbors(start))
			throw new Error(`"${start}" is not a defined node in the graph`);

		const paths = {};
		const visited = {};
		const distances = {};
		const nodes = this.nodes;
		const PQueue = new PriorityQueue();

		nodes.forEach((node) => {
			distances[node] = Infinity;
			paths[node] = [];
		});

		distances[start] = 0;
		PQueue.enqueue(start, 0);

		while (!PQueue.isEmpty()) {
			const { value: currentNode } = PQueue.dequeue();

			if (!visited[currentNode]) {
				visited[currentNode] = true;
				const currentNodeNeighbors = this.getNodeNeighbors(currentNode);

				currentNodeNeighbors.forEach((neighbor) => {
					const [neighborName, neighborWeight] = neighbor;
					const calculatedNeighborDistance = distances[currentNode] + neighborWeight;
					const currentNeighborDistance = distances[neighborName];

					if (calculatedNeighborDistance < currentNeighborDistance) {
						distances[neighborName] = calculatedNeighborDistance;
						paths[neighborName] = paths[currentNode].concat(currentNode);
						PQueue.enqueue(neighborName, neighborWeight);
					}
				});
			}
		}

		return { distances, paths };
	}

	bellmanFord(start) {
		if (!this.getNodeNeighbors(start))
			throw new Error(`start: ${start} is not a defined node in the graph!`);

		const nodes = this.nodes;
		const distances = {};
		const parents = {};
		const cycles = [];

		nodes.forEach((node) => {
			distances[node] = Infinity;
		});

		distances[start] = 0;

		// relaxing edges between nodes
		for (let i = 0; i < nodes.length - 1; i++) {
			nodes.forEach((node) => {
				if (distances[node] === Infinity) {
					return;
				}

				const currentNodeNeighbors = this.getNodeNeighbors(node);
				currentNodeNeighbors.forEach((neighbor) => {
					const [neighborName, neighborWeight] = neighbor;

					const calculatedNeighborDistance = distances[node] + neighborWeight;
					const currentNeighborDist = distances[neighborName];

					if (calculatedNeighborDistance < currentNeighborDist) {
						distances[neighborName] = calculatedNeighborDistance;
						parents[neighborName] = node;
					}
				});
			});
		}

		// detecting negative weight cycles
		nodes.forEach((node) => {
			const currentNodeNeighbors = this.getNodeNeighbors(node);
			currentNodeNeighbors.forEach((neighbor) => {
				const [neighborName, neighborWeight] = neighbor;
				const calcDist = distances[node] + neighborWeight;
				const currentNeighborDist = distances[neighborName];

				if (calcDist < currentNeighborDist) {
					// backtrack to find the path to the negative cycle
					let cycleTrack = [node, neighborName];
					let parent = parents[node];

					while (parent !== node && !cycleTrack.includes(parent)) {
						cycleTrack.unshift(parent);
						parent = parents[parent];
					}

					cycles.push(cycleTrack);
				}
			});
		});

		console.log(cycles);
		return { distances, parents, cycles };
	}
}

export class GraphListDirect extends GraphList {
	constructor(size) {
		super(size);
	}

	isNeighbors(source, destination) {
		const [sourceNode] = GraphListUtils.getEdgeNodes(source, destination, this.graph);

		const isFoundDestInSrc = sourceNode.find((neighbor) => neighbor[0] === destination);

		return !!isFoundDestInSrc;
	}

	addEdge(source, destination, weight = 0) {
		if (this.isNeighbors(source, destination)) return;

		const [sourceNode] = GraphListUtils.getEdgeNodes(source, destination, this.graph);

		sourceNode.push([destination, weight]);
		this.graph.setKey(source, sourceNode);
	}

	addNode(node) {
		if (!node) {
			throw new Error("Please specify a node name");
		}

		if (!this.getNodeNeighbors(node)) {
			this.graph.setKey(node, []);
		}
		return;
	}

	removeEdge(source, destination) {
		const [sourceNode] = GraphListUtils.getEdgeNodes(source, destination, this.graph);

		if (!this.isNeighbors(source, destination))
			throw new Error(`${source} and ${destination} are not neighbors`);

		this.graph.setKey(
			source,
			sourceNode.filter((neighbor) => neighbor[0] !== destination)
		);
	}
}

export class GraphListIndirect extends GraphList {
	constructor(size) {
		super(size);
	}

	isNeighbors(source, destination) {
		const [sourceNode, destinationNode] = GraphListUtils.getEdgeNodes(
			source,
			destination,
			this.graph
		);

		const isFoundDestInSrc = sourceNode.find((neighbor) => neighbor[0] === destination);

		const isFoundSrcInDest = destinationNode.find((neighbor) => neighbor[0] === source);

		return !!(isFoundDestInSrc && isFoundSrcInDest);
	}

	addEdge(source, destination, weight = 1) {
		if (this.isNeighbors(source, destination)) return;

		const [sourceNode, destinationNode] = GraphListUtils.getEdgeNodes(
			source,
			destination,
			this.graph
		);

		sourceNode.push([destination, weight]);
		this.graph.setKey(source, sourceNode);

		destinationNode.push([source, weight]);
		this.graph.setKey(destination, destinationNode);
	}

	addNode(node) {
		if (!node) {
			throw new Error("Please specify a node name");
		}

		if (!this.getNodeNeighbors(node)) {
			this.graph.setKey(node, []);
		}

		return;
	}

	removeEdge(source, destination) {
		if (!this.isNeighbors(source, destination))
			throw new Error(`${source} and ${destination} nodes are not neighbors`);

		const sourceNode = this.getNodeNeighbors(source);
		const destinationNode = this.getNodeNeighbors(destination);

		this.graph.setKey(
			source,
			sourceNode.filter((neighbor) => neighbor[0] !== destination)
		);

		this.graph.setKey(
			destination,
			destinationNode.filter((neighbor) => neighbor[0] !== source)
		);
	}
}

// const directedGraph = new GraphListDirect();
// const indirectGraph = new GraphListIndirect();

// directedGraph.addNode("Book");
// directedGraph.addNode("Rare-LP");
// directedGraph.addNode("Poster");
// directedGraph.addNode("Drum-set");
// directedGraph.addNode("Bass-Guitar");
// directedGraph.addNode("Piano");
// directedGraph.addNode("Sohila");

// directedGraph.addEdge("Book", "Rare-LP", 5);
// directedGraph.addEdge("Book", "Poster", 0);
// directedGraph.addEdge("Poster", "Bass-Guitar", 30);
// directedGraph.addEdge("Poster", "Drum-set", 35);
// directedGraph.addEdge("Rare-LP", "Bass-Guitar", 15);
// directedGraph.addEdge("Rare-LP", "Drum-set", 20);
// directedGraph.addEdge("Rare-LP", "Poster", -7);
// directedGraph.addEdge("Bass-Guitar", "Piano", 20);
// directedGraph.addEdge("Drum-set", "Piano", 10);

// const outputBMF = directedGraph.bellmanFord("Book");
// console.log(outputBMF);

// const outputDIJ = directedGraph.shortestPath("Book");
// console.log(outputDIJ);

// const outputDFS = directedGraph.dfs("Book");
// console.log(outputDFS);

// const callbackFun = (node) => {
// 	// we assuming here that mango sellers
// 	// are the ones with a name length higher than 3
// 	if (node.length > 4) return true;
// 	return false;
// };
// const mangoSellersNoCB = directedGraph.bfs("Book");
// const mangoSellers = directedGraph.bfs("Book", callbackFun);

// console.log(mangoSellersNoCB);
// console.log(mangoSellers);

// console.log(indirectGraph.isNeighbors("Book", "Rare-LP"));
// console.log(indirectGraph.isNeighbors("Rare-LP", "Book"));
// console.log(indirectGraph.isNeighbors("Sohila", "Book"));

// indirectGraph.removeNode("bob");

// console.log(indirectGraph.getNodeNeighbors("Book"));

// console.log(indirectGraph.getGraph());

// indirectGraph.removeEdge("Book", "Rare-LP");
// indirectGraph.removeEdge("Book", "Sohila");

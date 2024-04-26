import HashTable from "./hash-table.js";
import { Queue, PriorityQueue } from "./queue.js";

class GraphListUtils {
	static getEdgeNodes(source, destination, graph) {
		if (!source || !destination) {
			throw new Error(
				"source and destination nodes name must be defined"
			);
		}

		const sourceNode = graph.getKey(source);
		const destinationNode = graph.getKey(destination);

		if (!sourceNode || !destinationNode)
			throw new Error(
				`Either ${source} or ${destination} nodes are not defined`
			);

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
		const startNodeNeighbors = this.getNodeNeighbors(start);

		if (!startNodeNeighbors || !startNodeNeighbors.length)
			throw new Error(`${start} is not a defined node in the graph`);

		const queue = new Queue();
		const result = [];
		const visited = {};

		queue.enqueue(start);

		while (!queue.isEmpty()) {
			const currentNodeName = queue.dequeue();

			if (!visited[currentNodeName]) {
				const currentNodeNeighbors =
					this.getNodeNeighbors(currentNodeName);

				for (let i = 0; i < currentNodeNeighbors.length; i++) {
					queue.enqueue(currentNodeNeighbors[i][0]);
				}

				if (compareCB && compareCB(currentNodeName)) {
					result.push(currentNodeName);
				} else if (!compareCB) {
					result.push(currentNodeName);
				}

				visited[currentNodeName] = true;
			}
		}

		return result;
	}

	shortestPath(start) {
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
				const currentNodeNeighbors = this.getNodeNeighbors(currentNode);

				visited[currentNode] = true;

				currentNodeNeighbors.forEach((neighbor) => {
					const [neighborName, neighborWeight] = neighbor;

					if (neighborWeight < 0)
						throw new Error(
							"this method can not work on negative weights, use Bellman-Ford instead"
						);

					const calculatedNeighborDistance =
						distances[currentNode] + neighborWeight;

					const currentNeighborDistance = distances[neighborName];

					if (calculatedNeighborDistance < currentNeighborDistance) {
						distances[neighborName] = calculatedNeighborDistance;

						paths[neighborName] =
							paths[currentNode].concat(currentNode);

						PQueue.enqueue(neighborName, neighborWeight);
					}
				});
			}
		}

		return { distances, paths };
	}
}

export class GraphListDirect extends GraphList {
	constructor(size) {
		super(size);
	}

	isNeighbors(source, destination) {
		const [sourceNode] = GraphListUtils.getEdgeNodes(
			source,
			destination,
			this.graph
		);

		const isFoundDestInSrc = sourceNode.find(
			(neighbor) => neighbor[0] === destination
		);

		return !!isFoundDestInSrc;
	}

	addEdge(source, destination, weight = 0) {
		if (this.isNeighbors(source, destination)) return;

		const [sourceNode] = GraphListUtils.getEdgeNodes(
			source,
			destination,
			this.graph
		);

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
		const [sourceNode] = GraphListUtils.getEdgeNodes(
			source,
			destination,
			this.graph
		);

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

		const isFoundDestInSrc = sourceNode.find(
			(neighbor) => neighbor[0] === destination
		);

		const isFoundSrcInDest = destinationNode.find(
			(neighbor) => neighbor[0] === source
		);

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
			throw new Error(
				`${source} and ${destination} nodes are not neighbors`
			);

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

// indirectGraph.addNode("Book");
// indirectGraph.addNode("Rare-LP");
// indirectGraph.addNode("Poster");
// indirectGraph.addNode("Drum-set");
// indirectGraph.addNode("Bass-Guitar");
// indirectGraph.addNode("Piano");
// indirectGraph.addNode("Sohila");

// indirectGraph.addEdge("Book", "Rare-LP", 5);
// indirectGraph.addEdge("Book", "Poster", 0);
// indirectGraph.addEdge("Poster", "Bass-Guitar", 30);
// indirectGraph.addEdge("Poster", "Drum-set", 35);
// indirectGraph.addEdge("Rare-LP", "Bass-Guitar", 15);
// indirectGraph.addEdge("Rare-LP", "Drum-set", 20);
// indirectGraph.addEdge("Bass-Guitar", "Piano", 20);
// indirectGraph.addEdge("Drum-set", "Piano", 10);

// const { paths, distances } = indirectGraph.shortestPath("Book");

// console.log(paths);
// console.log(distances);

// const callbackFun = (node) => {
// 	// we assuming here that mango sellers
// 	// are the ones with a name length higher than 3
// 	if (node.length > 4) return true;
// 	return false;
// };
// const mangoSellersNoCB = indirectGraph.bfs("Book");
// const mangoSellers = indirectGraph.bfs("Book", callbackFun);

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

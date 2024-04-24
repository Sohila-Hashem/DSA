import HashTable from "./hash-table.js";
import { Queue } from "./queue.js";

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

	getGraph() {
		return this.graph.map;
	}

	getNodeNeighbors(node) {
		if (!node) throw new Error("node name must be provided");
		return this.graph.getKey(node);
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

	addEdge(source, destination, weight = 1) {
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
}

// const directedGraph = new GraphListDirect();
// const indirectGraph = new GraphListIndirect();

// indirectGraph.addNode("you");
// indirectGraph.addNode("alice");
// indirectGraph.addNode("bob");
// indirectGraph.addNode("claire");
// indirectGraph.addNode("peggy");
// indirectGraph.addNode("anuj");
// indirectGraph.addNode("Sohila");

// indirectGraph.addEdge("you", "alice");
// indirectGraph.addEdge("you", "bob");
// indirectGraph.addEdge("you", "claire");
// indirectGraph.addEdge("claire", "anuj");
// indirectGraph.addEdge("bob", "peggy", 8);
// indirectGraph.addEdge("alice", "peggy");
// indirectGraph.addEdge("alice", "peggy");

// const callbackFun = (node) => {
// 	// we assuming here that mango sellers
// 	// are the ones with a name length higher than 3
// 	if (node.length > 4) return true;
// 	return false;
// };
// const mangoSellersNoCB = indirectGraph.bfs("you");
// const mangoSellers = indirectGraph.bfs("you", callbackFun);

// console.log(mangoSellersNoCB);
// console.log(mangoSellers);

// console.log(indirectGraph.isNeighbors("you", "alice"));
// console.log(indirectGraph.isNeighbors("anuj", "claire"));
// console.log(indirectGraph.isNeighbors("Sohila", "claire"));

// indirectGraph.removeNode("bob");

// console.log(indirectGraph.getNodeNeighbors("you"));

// console.log(indirectGraph.getGraph());

// indirectGraph.removeEdge("alice", "peggy");
// indirectGraph.removeEdge("peggy", "alice");

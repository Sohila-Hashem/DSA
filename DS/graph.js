import HashTable from "./hash-table.js";
class GraphListUtils {
    static getEdgeNodes(source, destination, graph) {
        if (!source || !destination) {
            throw new Error("source and destination must be defined");
        }

        const sourceNode = graph.getKey(source);
        const destinationNode = graph.getKey(destination);

        return [sourceNode, destinationNode];
    }
}

export default class GraphList {
    #graph;

    constructor(size = 3333) {
        this.#graph = new HashTable(size);
    }

    getGraph() {
        return Object.values(this.#graph);
    }

    getNodeNeighbors(vertex) {
        if (!vertex) throw new Error("vertex name must be provided");
        return this.#graph.getKey(vertex);
    }

    // add edge/arrow to a node/vertex
    addEdge(source, destination, options = { weight: 1, isDirected: false }) {
        if (this.isNeighbors(source, destination)) return;

        const [sourceNode, destinationNode] = GraphListUtils.getEdgeNodes(
            source,
            destination,
            this.#graph
        );

        if (!sourceNode || !destinationNode)
            throw new Error("Either source or destination node is not defined");

        if (!options.isDirected) {
            destinationNode.push({
                nodeName: source,
                weight: options.weight || 1,
            });
            this.#graph.setKey(destination, destinationNode);
        }

        sourceNode.push({ nodeName: destination, weight: options.weight || 1 });
        this.#graph.setKey(source, sourceNode);
    }

    // add node/vertex to graph
    addNode(node) {
        if (!node) {
            throw new Error("Please specify a node identifier");
        }

        if (!this.getNodeNeighbors(node)) {
            this.#graph.setKey(node, []);
        }

        return;
    }

    // remove edge/arrow from graph
    removeEdge(source, destination) {
        if (!this.isNeighbors(source, destination))
            throw new Error("source and destination nodes are not neighbors");

        const [sourceNode, destinationNode] = GraphListUtils.getEdgeNodes(
            source,
            destination,
            this.#graph
        );

        let isUndirectedRS = false;

        destinationNode.forEach((neighbor) => {
            if (neighbor.nodeName === source) isUndirectedRS = true;
        });

        if (isUndirectedRS) {
            this.#graph.setKey(
                destination,
                destinationNode.filter(
                    (neighbor) => neighbor.nodeName !== source
                )
            );
        }

        this.#graph.setKey(
            source,
            sourceNode.filter((neighbor) => neighbor.nodeName !== destination)
        );
    }

    // remove vertex/node from graph
    removeNode(node) {
        const nodeNeighbors = this.getNodeNeighbors(node);

        if (!nodeNeighbors.length) {
            this.#graph.removeKey(node);
            return true;
        }

        for (let i = 0; i < nodeNeighbors.length; i++) {
            this.removeEdge(node, nodeNeighbors[i].nodeName);
        }

        this.#graph.removeKey(node);
        return true;
    }

    isNeighbors(source, destination) {
        if (!source || !destination)
            throw new Error("source and destination must be defined");

        const [sourceNode, destinationNode] = GraphListUtils.getEdgeNodes(
            source,
            destination,
            this.#graph
        );

        const isFoundDestInSrc = sourceNode.find(
            (neighbor) => neighbor.nodeName === destination
        );

        const isFoundSrcInDest = destinationNode.find(
            (neighbor) => neighbor.nodeName === source
        );

        if ((isFoundDestInSrc && isFoundSrcInDest) || isFoundDestInSrc) {
            return true;
        }

        return false;
    }
}

// const graph = new GraphList();
// const isDirected = true;

// graph.addNode("you");
// graph.addNode("alice");
// graph.addNode("bob");
// graph.addNode("claire");
// graph.addNode("peggy");
// graph.addNode("anuj");
// graph.addNode("Sohila");

// graph.addEdge("you", "alice", { isDirected });
// graph.addEdge("you", "bob", { isDirected });
// graph.addEdge("you", "claire");
// graph.addEdge("claire", "anuj", { isDirected });
// graph.addEdge("bob", "peggy", { isDirected });
// graph.addEdge("alice", "peggy", { isDirected });
// graph.addEdge("alice", "peggy", { isDirected });

// console.log(graph.isNeighbors("you", "alice"));
// console.log(graph.isNeighbors("anuj", "claire"));

// graph.removeEdge("alice", "peggy");
// graph.removeEdge("peggy", "alice");

// graph.removeNode("you");

// console.log(graph.getNodeNeighbors("claire"));

// console.log(graph.getGraph());

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
        if (this.#nodeList[node]) return;

        if (this.#currentNodeIndex > this.#size)
            throw new Error("the graph is in full capacity");

        this.#nodeList[node] = this.#currentNodeIndex++;
    }

    addEdge(source, destination) {
        const [sourceNodeIndex, destinationNodeIndex] =
            GraphMatrixUtils.checkExistenceOfNodes(
                source,
                destination,
                this.#nodeList
            );

        this.#matrix[sourceNodeIndex][destinationNodeIndex] = 1;
        this.#matrix[destinationNodeIndex][sourceNodeIndex] = 1;
    }

    removeEdge(source, destination) {
        const [sourceNodeIndex, destinationNodeIndex] =
            GraphMatrixUtils.checkExistenceOfNodes(
                source,
                destination,
                this.#nodeList
            );

        this.#matrix[sourceNodeIndex][destinationNodeIndex] = 0;
        this.#matrix[destinationNodeIndex][sourceNodeIndex] = 0;
    }

    removeNode(node) {
        const nodeIndex = GraphMatrixUtils.getNodeIndex(node, this.#nodeList);

        for (let i = 0; i < this.#matrix.length; i++) {
            this.#matrix[i][nodeIndex] = 0;
        }

        for (let i = 0; i < this.#matrix[nodeIndex].length; i++) {
            this.#matrix[nodeIndex][i] = 0;
        }

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

        return !!this.#matrix[sourceNodeIndex][destinationNodeIndex];
    }
}

// const graphMatrix = new GraphMatrix();

// graphMatrix.addNode("A");
// graphMatrix.addNode("B");
// graphMatrix.addNode("C");
// graphMatrix.addNode("D");
// graphMatrix.addNode("E");
// graphMatrix.addNode("F");
// graphMatrix.addNode("G");
// graphMatrix.addNode("N");

// graphMatrix.addEdge("A", "B");
// graphMatrix.addEdge("A", "C");
// graphMatrix.addEdge("C", "B");
// graphMatrix.addEdge("C", "F");
// graphMatrix.addEdge("C", "N");
// graphMatrix.addEdge("N", "F");
// graphMatrix.addEdge("B", "D");
// graphMatrix.addEdge("F", "E");
// graphMatrix.addEdge("D", "G");
// graphMatrix.addEdge("E", "G");

// console.log(graphMatrix.getNode("C"));

// console.log(graphMatrix.isNeighbors("C", "F"));
// console.log(graphMatrix.isNeighbors("C", "D"));

// graphMatrix.removeEdge("A", "B");

// console.log(graphMatrix.isNeighbors("A", "B"));

// graphMatrix.removeNode("C");

// console.log(graphMatrix.getMatrix());
// console.log(graphMatrix.getNodeList());

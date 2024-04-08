import HashTable from "./hash-table.js";

export default class GraphList {
    #graph;

    constructor(size = 3333) {
        this.#graph = new HashTable(size);
    }

    getGraph() {
        return Object.values(this.#graph);
    }

    getNodeNeighbors(vertex) {
        return this.#graph.getKey(vertex);
    }

    // add edge/arrow to a node/vertex
    addEdge(source, destination) {
        let [sourceNode, destinationNode] =
            GraphListUtils.checkExistenceOfNodes(
                source,
                destination,
                this.#graph
            );

        this.#graph.setKey(source, [...sourceNode, destination]);
        this.#graph.setKey(destination, [...destinationNode, source]);
    }

    // add node/vertex to graph
    addNode(node) {
        if (!node) {
            throw new Error("Please specify a node");
        }

        if (!this.getNodeNeighbors(node)) {
            this.#graph.setKey(node, []);
        }

        return;
    }

    // remove edge/arrow from graph
    removeEdge(source, destination) {
        const [sourceNode, destinationNode] =
            GraphListUtils.checkExistenceOfNodes(
                source,
                destination,
                this.#graph
            );

        this.#graph.setKey(
            source,
            sourceNode.filter((neighbor) => neighbor !== destination)
        );
        this.#graph.setKey(
            destination,
            destinationNode.filter((neighbor) => neighbor !== source)
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
            this.removeEdge(node, nodeNeighbors[i]);
        }

        return this.#graph.removeKey(node);
    }

    isNeighbors(source, destination) {
        if (!source || !destination)
            throw new Error("source and destination must be defined");

        const [sourceNode, destinationNode] =
            GraphListUtils.checkExistenceOfNodes(
                source,
                destination,
                this.#graph
            );

        console.log(sourceNode, destinationNode);
    }
}

class GraphListUtils {
    static checkExistenceOfNodes(source, destination, graph) {
        if (!source || !destination) {
            throw new Error("source and destination must be defined");
        }

        const sourceNode = graph.getKey(source);
        const destinationNode = graph.getKey(destination);

        if (!sourceNode || !destinationNode) {
            throw new Error("either source or destination does not exist");
        }

        return [sourceNode, destinationNode];
    }
}

// const graph = new GraphList();

// graph.addNode("you");
// graph.addNode("alice");
// graph.addNode("bob");
// graph.addNode("claire");
// graph.addNode("peggy");
// graph.addNode("anuj");
// graph.addNode("Sohila");

// graph.addEdge("you", "alice");
// graph.addEdge("you", "bob");
// graph.addEdge("you", "claire");
// graph.addEdge("claire", "anuj");
// graph.addEdge("bob", "peggy");
// graph.addEdge("alice", "peggy");

// graph.isNeighbors("you", "alice");

// console.log(graph.getNodeNeighbors("you"));

// graph.removeNode("you");

// console.log(graph.getGraph());

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

import HashTable from "./hash-table.js";
import { Queue } from "./queue.js";
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
            destinationNode.push([source, options.weight || 1]);
            this.#graph.setKey(destination, destinationNode);
        }
        sourceNode.push([destination, options.weight || 1]);
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
            if (neighbor[0] === source) isUndirectedRS = true;
        });

        if (isUndirectedRS) {
            this.#graph.setKey(
                destination,
                destinationNode.filter((neighbor) => neighbor[0] !== source)
            );
        }

        this.#graph.setKey(
            source,
            sourceNode.filter((neighbor) => neighbor[0] !== destination)
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
            this.removeEdge(node, nodeNeighbors[i][0]);
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
            (neighbor) => neighbor[0] === destination
        );

        const isFoundSrcInDest = destinationNode.find(
            (neighbor) => neighbor[0] === source
        );

        if ((isFoundDestInSrc && isFoundSrcInDest) || isFoundDestInSrc) {
            return true;
        }

        return false;
    }

    bfs(start, compareCB) {
        const startNodeNeighbors = this.getNodeNeighbors(start);

        if (!startNodeNeighbors)
            throw new Error(`${start} is not a defined node in the graph`);

        const queue = new Queue();
        const result = [];
        const visited = {};

        queue.enqueue(start);

        while (!queue.isEmpty()) {
            const currentNode = queue.dequeue();

            if (!visited[currentNode]) {
                // if (compareCB(currentNode)) result.push(currentNode);
                const nodeNeighbors = this.getNodeNeighbors(currentNode);

                for (let i = 0; i < nodeNeighbors.length; i++) {
                    queue.enqueue(nodeNeighbors[i][0]);
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
// graph.addEdge("bob", "peggy", { isDirected, weight: 8 });
// graph.addEdge("alice", "peggy", { isDirected });
// graph.addEdge("alice", "peggy", { isDirected });

// console.log(graph.isNeighbors("you", "alice"));
// console.log(graph.isNeighbors("anuj", "claire"));

// graph.removeEdge("alice", "peggy");
// graph.removeEdge("peggy", "alice");

// graph.removeNode("you");

// console.log(graph.getNodeNeighbors("claire"));

// console.log(graph.getGraph());

// const callbackFun = (node) => {
//     // we assuming here that mango sellers
//     // are the ones with a name length higher than 3
//     if (node.length > 3) return true;
//     return false;
// };
// const mangoSellersNoCB = graph.bfs("alice");
// const mangoSellers = graph.bfs("alice", callbackFun);

// console.log(mangoSellersNoCB);
// console.log(mangoSellers);

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

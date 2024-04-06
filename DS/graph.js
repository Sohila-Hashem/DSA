import HashTable from "./hash-table.js";

export default class Graph {
    constructor() {
        this.graph = new HashTable(150);
    }

    #checkExistenceForEdges(source, destination) {
        if (!source || !destination) {
            throw new Error("source and destination must be defined");
        }

        const sourceVertex = this.graph.getKey(source);
        const destinationVertex = this.graph.getKey(destination);

        return [sourceVertex, destinationVertex];
    }

    getGraph() {
        return this.graph;
    }

    getVertexNeighbors(vertex) {
        return this.graph.getKey(vertex);
    }

    // add edge/arrow to a node/vertex
    addEdge(source, destination) {
        let [sourceVertex, destinationVertex] = this.#checkExistenceForEdges(
            source,
            destination
        );

        if (!sourceVertex) {
            sourceVertex = this.addVertex(source);
        }

        if (!destinationVertex) {
            destinationVertex = this.addVertex(destination);
        }

        this.graph.setKey(source, [...(sourceVertex || []), destination]);
        this.graph.setKey(destination, [...(destinationVertex || []), source]);
    }

    // add node/vertex to graph
    addVertex(vertex) {
        if (!vertex) {
            throw new Error("Please specify a vertex");
        }
        this.graph.setKey(vertex, []);
    }

    // remove edge/arrow from graph
    removeEdge(source, destination) {
        const [sourceVertex, destinationVertex] = this.#checkExistenceForEdges(
            source,
            destination
        );

        if (!sourceVertex || !destinationVertex) {
            throw new Error("Either source or destination is undefined");
        }

        this.graph.setKey(
            source,
            sourceVertex.filter((neighbor) => neighbor !== destination)
        );
        this.graph.setKey(
            destination,
            destinationVertex.filter((neighbor) => neighbor !== source)
        );
    }

    // remove node/vertex from graph
    removeVertex(vertex) {
        const vertexNeighbors = this.getVertexNeighbors(vertex);

        if (!vertexNeighbors.length) {
            this.graph.removeKey(vertex);
            return true;
        }

        for (let i = 0; i < vertexNeighbors.length; i++) {
            this.removeEdge(vertex, vertexNeighbors[i]);
        }

        return this.graph.removeKey(vertex);
    }
}

// const graph = new Graph();

// graph.addEdge("you", "alice");
// graph.addEdge("you", "bob");
// graph.addEdge("you", "claire");
// graph.addEdge("claire", "anuj");
// graph.addEdge("bob", "peggy");
// graph.addEdge("alice", "peggy");

// // graph.addVertex();

// console.log(graph.getVertexNeighbors("you"));

// graph.removeVertex("you");

// console.log(graph.getGraph());

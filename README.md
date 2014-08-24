# graph-json [![Build Status](https://travis-ci.org/mananshah99/graph-json.svg?branch=master)](https://travis-ci.org/mananshah99/graph-json) [![NPM version](https://badge.fury.io/js/graph-json.svg)](http://badge.fury.io/js/graph-json) [![Dependencies](https://www.versioneye.com/user/projects/53f2bfe813bb06a3d3000c24/badge.svg?style=flat)](https://www.versioneye.com/user/projects/53f2bfe813bb06a3d3000c24)

[![NPM](https://nodei.co/npm/graph-json.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/graph-json/)

A JSON-format backed graph library with advanced identification algorithms. 

## JSON Scheme (DirectedGraph): 
```json
{
    "type": "object",
    "properties": {
        "nodes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true
                    }
                }
            }
        },
        "edges": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": true
                    },
                    "from": {
                        "type": "string",
                        "required": true
                    },
                    "to": {
                        "type": "string",
                        "required": true
                    }
                }
            }
        }
    }
}
```

## Documentation

## DirectedGraph

You can use the `DirectedGraph` library in your project by either calling
```js
var DirectedGraph = require('graph-json').DirectedGraph;
```
or
```js
var DirectedGraph = require('graph-json').DG;
```
### function DirectedGraph([struct])

Creates a directed graph based on the structure defined (a `.json` object matching the specification), or creates a graph with no edges and nodes if `struct` is not specified. 

An example struct would look like the following (used in the remainder of the documentation) 
```json
{
    "nodes": [
        {
            "name": "A"
        },
        {
            "name": "B"
        },
        {
            "name": "C",
            "data": "__DATA__"
        },
        { 
            "name": "T"
        }
    ],
    "edges": [
        {
            "name": "AB",
            "from": "A",
            "to": "B",
            "data" : "__DATA__"
        },
        {
            "name": "BC",
            "from": "B",
            "to": "C"
        }
    ]
}
```

In order to create a graph, you'll want to parse your JSON object and pass it as a parameter. For example, 
```js
//g is the JSON parsed object of graph.json located in the executing directory
var g = JSON.parse(fs.readFileSync('./graph.json'));

//t_graph is the graph created from graph.json
var t_graph = new DirectedGraph(g);
```
Or, you can create a graph without specifying a JSON file: 
```js
var t_graph = new DirectedGraph();
```
The graph above contains no nodes and no edges. 

### DirectedGraph.prototype.edgesIn = function (node) 

Returns the number of edges entering a given node. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var x = t_graph.edgesIn('B');
console.log(x[0].from); // #==> for the test graph, should print 'A'
```

### DirectedGraph.prototype.edgesOut = function (node) 

Returns the number of edges exiting a given node. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var x = t_graph.edgesOut('A');
console.log(x[0].to) // #==> for the test graph, should print 'B'
```

### DirectedGraph.prototype.getNode = function (id) 

Returns a node contained in the graph with the given name (`id`).

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var node = t_graph.getNode('C'); // #==> assigns the variable node to the node of the graph with name 'C'
```

### DirectedGraph.prototype.numNodes = function ()

Returns the number of nodes contained in the graph.

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

console.log(t_graph.numNodes()); // #==> prints '3' for the test graph
```

### DirectedGraph.prorotype.getEdge = function (id) 

Returns an edge contained in the graph with the given name (`id`).

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var edge = t_graph.getEdge('BC'); // #==> assigns the variable edge to the edge of the graph with name 'BC'
```

### DirectedGraph.prototype.numEdges = function () 

Returns the number of edges contained in the graph.

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

console.log(t_graph.numEdges()) // #==> prints '2' for the test graph
```

### DirectedGraph.prototype.edges = function () 

Returns the edges array internally stored in `graph-json`. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var edge_array = t_graph.edges();
```

### DirectedGraph.prototype.isTerminal = function (node) 

Returns `true` if the specified node is ternminal (has no children), and false otherwise. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

console.log(t_graph.isTerminal('T')); // #==> prints 'true' for the test graph
```

### DirectedGraph.prototype.dfs = function (to_find, node, graph)

Performs a depth-first-search on the given graph, searching for `to_find` starting from `node`. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

console.log((t_graph.dfs('B', 'A', t_graph)); // #==> prints 'B' for the test graph (search successful) 
console.log((t_graph.dfs('dne', 'A', t_graph)); // #==> prints 'null' for the test graph (search failed) 
```

### function hangingEdges(graph, edges) 

Returns an array of the "hanging edges" - edges that either have no `from` or `to` node defined - in the current graph schema. 

```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

var x = hangingEdges(t_graph, t_graph.edges);
if (x.length !== 0) {
    return new ValidationError('Hanging Edges Found: ', x); // # ==> uh-oh! We have hanging edges in the graph.
}
// #==> seeing as the test graph is properly defined, no validation error will be thrown.
```

### DirectedGraph.prototype.addNode = function (name, [dt]) 

Adds a node to the graph with an optional parameter containing data. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

t_graph.addNode('A'); // adds node 'A' to the graph
t_graph.addNode('B', 'xyz'); // adds node 'B' to the graph, with data xyz
```

### DirectedGraph.prototype.addEdge = function (name, from, to, [dt])

Adds an edge to the graph with an optional parameter containing data.

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

t_graph.addEdge('A->B', 'A', 'B'); // adds edge 'A->B' to the graph from node A to node B
t_graph.addEdge('A->C', 'A', 'C', '10'); // adds edge 'A->C' to the graph from node A to node C with data 10
```

### DirectedGraph.prototype.add = function([nodes...]) 

Adds any number of nodes to a graph, automatically creating the nodes if they do not exist and creating edges between each adjacent node.

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

// the following creates nodes 'a', 'b', 'c', and 'd' if they do not exist,
// and then creates the edges a->b, b->c, and c->d
t_graph.add('a', 'b', 'c', 'd'); 
```

### DirectedGraph.prototype.tSort = function ()

Topologically sorts the graph and returns the resulting node array.

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

console.log(t_graph.tSort()); //prints a comma-delimited topologically sorted node order of t_graph
```

### DirectedGraph.prototype.isAcyclic = function ()

Returns `true` if the graph is acyclic, `false` otherwise. Uses a topological sort under the hood. 

Example:
```js
var g = JSON.parse(fs.readFileSync('./graph.json'));
var t_graph = new DirectedGraph(g);

if(t_graph.isAcyclic()) {
    //do something
}
else {
    //do something else
}
```

## UndirectedGraph

Need to add this documentation. 

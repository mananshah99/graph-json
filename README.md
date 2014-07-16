# graph-json [![Build Status](https://travis-ci.org/mananshah99/graph-json.svg?branch=master)](https://travis-ci.org/mananshah99/graph-json) [![NPM version](https://badge.fury.io/js/graph-json.svg)](http://badge.fury.io/js/graph-json)

[![NPM](https://nodei.co/npm/graph-json.png?downloads=true)](https://nodei.co/npm/graph-json/)

A JSON-format backed graph with basic identification algorithms. 

## JSON Scheme: 
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

### function ValidationError(message, err) 

Specific error to the `graph-json` module that is thrown whenever a portion of the graph schema is unable to validated properly. 

Potential times this error would be thrown are if: a) hanging edges exist in the graph, b) the JSON file provided does not match the default specification, c) no JSON file is provided, d) duplicate nodes are provided in the JSON file, or e) duplicate edges are provided in the JSON file.

Example:
```js
var scheme = require('./scheme.json');

var test = validator.validate(struct, scheme);
if (test.errors.length > 0) {
    return new ValidationError('Validation of Graph Failed: ', test.errors);
}
```

### function Graph(struct)

Creates a graph based on the structure defined (a `.json` file matching the specification). 

An example graph would look like the following (used in the remainder of the documentation) 
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

### Graph.prototype.edgesIn = function (node) 

Returns the number of edges entering a given node. 

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
var x = t_graph.edgesIn('B');
console.log(x[0].from); // #==> for the test graph, should print 'A'
```

### Graph.prototype.edgesOut = function (node) 

Returns the number of edges exiting a given node. 

Returns the number of edges entering a given node. 

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
var x = t_graph.edgesOut('A');
console.log(x[0].to) // #==> for the test graph, should print 'B'
```

### Graph.prototype.getNode = function (id) 

Returns a node contained in the graph with the given name, `id`.

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
var node = t_graph.getNode('C'); // #==> assigns the variable node to the node of the graph with name 'C'
```

### Graph.prototype.numNodes = function ()

Returns the number of nodes contained in the graph.

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
console.log(t_graph.numNodes()); // #==> prints '3' for the test graph
```

### Graph.prorotype.getEdge = function (id) 

Returns an edge contained in the graph with the given name, `id`.

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
var edge = t_graph.getEdge('BC'); // #==> assigns the variable edge to the edge of the graph with name 'BC'
```

### Graph.prototype.numEdges = function () 

Returns the number of edges contained in the graph.

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
console.log(t_graph.numEdges()) // #==> prints '2' for the test graph
```

### Graph.prototype.isTerminal = function (node) 

Returns `true` if the specified node is ternminal (has no children), and false otherwise. 

Example:
```js
var ts = require('./test_scheme.json');
t_graph = new Graph(ts);
console.log(t_graph.isTerminal('T')); // #==> prints 'true' for the test graph
```

### Graph.prototype.dfs = function (to_find, node, graph)

Performs a depth-first-search on the given graph, searching for `to_find` starting from `node`. 

Example:
```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
console.log((t_graph.dfs('B', 'A', t_graph)); // # ==> prints 'B' for the test graph (search successful) 
console.log((t_graph.dfs('dne', 'A', t_graph)); // #==> prints 'null' for the test graph (search failed) 
```

### function hangingEdges(graph, edges) 

Returns an array of the "hanging edges" - edges that either have no `from` or `to` node defined - in the current graph schema. 

```js
var ts = require('./test_scheme.json');

t_graph = new Graph(ts);
x = hangingEdges(t_graph, t_graph.edges);
if (x.length !== 0) {
    return new ValidationError('Hanging Edges Found: ', x); # ==> uh-oh! We have hanging edges in the graph.
}
// #==> seeing as the test graph is properly defined, no validation error will be thrown.
```
var util = require('util');
var JSV = require('JSV').JSV;
var validator = JSV.createEnvironment();
var scheme = require('./scheme.json');

function ValidationError(message, err) {
    Error.call(this);
    this.err = err;
}
util.inherits(ValidationError, Error);

function Graph(struct) {
    if (!struct) return new ValidationError('No struct argument provided');
    
    var test = validator.validate(struct, scheme);
    if (test.errors.length > 0) return new ValidationError('Validation of Graph Failed: ', test.errors);

    var uq = areUq(struct.nodes, 'name');
    if (uq.length !== 0) return new ValidationError('Duplicate Nodes Found: ', uq);
    
    this.nodes = struct.nodes;
    
    var uq = areUq(struct.edges, 'name');
    if (uq.length !== 0) return new ValidationError('Duplicate Edges Found: ', uq);   
    
    var x = hangingEdges(this, struct.edges);
    if (x.length !== 0) return new ValidationError('Hanging Edges Found: ', x);
    
    this.edges = struct.edges;
}

Graph.prototype.edgesIn = function (node) {
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.to === t.name;
        })
    );
};

Graph.prototype.edgesOut = function (node) {
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.from === t.name;
        })
    );
};


Graph.prototype.getNode = function (id) {
    return (
        this.nodes.filter(function (node) {
            return node.name === id;
        })[0]
    );
};

Graph.prototype.numNodes = function() {
    return nodes.length;
};

Graph.prototype.getEdge = function (id) {
    return (
        this.edges.filter(function (edge) {
            return edge.name === id;
        })[0]
    );
};

Graph.prototype.numEdges = function() {
    return edges.length;
};

Graph.prototype.isTerminal = function (node) {
    return this.edgesOut(node).length === 0;
};

function hangingEdges(graph, edges) {
    var err = [];
    edges.forEach(function (edge) {
        var from = graph.getNode(edge.from);
        var to = graph.getNode(edge.to);
        if (!from || !to) err.push(edge);
    });
    return err;
}

function areUq(arr, val) {
    var ct = {};
    var dup = {};

    arr.forEach(function (idx) {
        var v = idx[val];
        if(ct[v]) dup[v] = 1;
        else ct[v] = 1;
    });

    return Object.keys(dup);
}

Graph.errors = {
    ValidationError: ValidationError
};

module.exports = Graph;
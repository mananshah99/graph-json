/*global require, Graph, nodes, edges, module*/

var util = require('util');
var fs = require('fs');
var JSV = require('JSV').JSV;
var validator = JSV.createEnvironment();
var scheme = require('./scheme.json');
var tsort = require('tsort');

var tGraph = tsort();

function ValidationError(message, err) {
    'use strict';
    Error.call(this);
    this.err = err;
}
util.inherits(ValidationError, Error);

Graph.prototype.edgesIn = function (node) {
    'use strict';
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.to === t.name;
        })
    );
};

Graph.prototype.edgesOut = function (node) {
    'use strict';
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.from === t.name;
        })
    );
};

Graph.prototype.getNode = function (id) {
    'use strict';
    return (
        this.nodes.filter(function (node) {
            return node.name === id;
        })[0]
    );
};

Graph.prototype.numNodes = function () {
    'use strict';
    return nodes.length;
};

Graph.prototype.getEdge = function (id) {
    'use strict';
    return (
        this.edges.filter(function (edge) {
            return edge.name === id;
        })[0]
    );
};

Graph.prototype.numEdges = function () {
    'use strict';
    return edges.length;
};

Graph.prototype.edges = function() {
    return edges;
};

Graph.prototype.isTerminal = function (node) {
    'use strict';
    return this.edgesOut(node).length === 0;
};

Graph.prototype.dfs = function (to_find, node, graph) {
    'use strict';
    var t_1 = (typeof to_find === 'string') ? this.getNode(to_find) : to_find,
        t_2 = (typeof node === 'string') ? this.getNode(node) : node,
        edges_out = graph.edgesOut(node),
        children = [],
        i = 0,
        child,
        found;
    
    if (t_1 === undefined || t_2 === undefined) {
        return null;
    }
    
    if (t_1.name === t_2.name) {
        return t_1;
    }
    
    for (i = 0; i < edges_out.length; i += 1) {
        children.push(edges_out[i].to);
    }
        
    for (i = 0; i < children.length; i += 1) {
        child = children[i];
        found = graph.dfs(to_find, child, graph);
        if (found) {
            return found;
        }
    }
    return null;
};

Graph.prototype.bfs = function (to_find, node, graph) {
    'use strict';
    //work on this next
};

function hangingEdges(graph, edges) {
    'use strict';
    var err = [],
        from,
        to;
    edges.forEach(function (edge) {
        var from = graph.getNode(edge.from),
            to = graph.getNode(edge.to);
        if (!from || !to) {
            err.push(edge);
        }
    });
    return err;
}

Graph.prototype.addNode = function(name, dt) {
    dt = (typeof dt === "undefined") ? null : dt;
    var nstr;
    if(dt === null) {
        nstr = {"name" : name };
    }
    else {
        nstr = {"name" : name, "data": dt};
    }
    this.nodes.push(nstr);
};

Graph.prototype.addEdge = function(name, from, to, dt) {
    //data (dt) is optional
    dt = (typeof dt === "undefined") ? null : dt;
    var nstr;
    if(dt === null) {
        nstr = {"name": name,"from": from,"to": to};
    }
    else {
        nstr = {"name": name,"from": from,"to": to,"data" : dt};
    }
    this.edges.push(nstr);
    tGraph.add(from, to);
}

// graph.add('a', 'b', 'c', 'd');
Graph.prototype.add = function() {
    var nodes = [].slice.call(arguments, 0);
    for (var i = 0, len = nodes.length; i < len; i++) {
        //make the nodes if they don't exist and then make the edge from from and to
        if (!this.getNode(nodes[i])) {
            this.addNode(nodes[i]);
        }
        if (i > 0) {
            this.addEdge('_e' + i, nodes[i - 1], nodes[i]);
        }
    }
}

Graph.prototype.tSort = function () {
    return tGraph.sort();
}

Graph.prototype.isAcyclic = function() {
    try {
        t_graph.tSort();
    }
    catch(e) {
        return false;
    }
    return true;
}

function areUq(arr, val) {
    'use strict';
    var ct = {},
        dup = {};

    arr.forEach(function (idx) {
        var v = idx[val];
        if (ct[v]) {
            dup[v] = 1;
        } else {
            ct[v] = 1;
        }
    });

    return Object.keys(dup);
}

Graph.errors = {
    ValidationError: ValidationError
};

function Graph(struct) {
    'use strict';
    
    //having a structure is also optional    
    if (typeof struct !== "undefined") {
        this.nodes = struct.nodes;
        this.edges = struct.edges;
    }
    else {
        this.nodes = [];
        this.edges = [];
    }

    var test = validator.validate({nodes: this.nodes, edges: this.edges}, scheme),
        uq = areUq(this.edges, 'name'),
        x;
    
    if (test.errors.length > 0) {
        throw new ValidationError('Validation of Graph Failed: ', test.errors);
    }
        
    if (uq.length !== 0) {
        throw new ValidationError('Duplicate Edges Found: ', uq);
    }
    
    x = hangingEdges(this, this.edges);
    if (x.length !== 0) {
        throw new ValidationError('Hanging Edges Found: ', x);
    }
        
    //initial edge adding to tGraph
    for(var i = 0; i < this.edges.length; i++) {
        var x = this.edges[i];
        var fname = x.from;
        var tname = x.to;
        tGraph.add(fname, tname);
    }
}

module.exports = Graph;
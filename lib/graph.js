/*global require, DirectedGraph, UndirectedGraph, nodes, edges, module*/

var util = require('util');
var fs = require('fs');
var JSV = require('JSV').JSV;
var validator = JSV.createEnvironment();
var scheme = require('./scheme.json');
var tsort = require('tsort');

function ValidationError(message, err) {
    'use strict';
    Error.call(this);
    this.err = err;
}
util.inherits(ValidationError, Error);

DirectedGraph.prototype.edgesIn = function (node) {
    'use strict';
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.to === t.name;
        })
    );
};

DirectedGraph.prototype.edgesOut = function (node) {
    'use strict';
    var t = (typeof node === 'string') ? this.getNode(node) : node;
    return (
        this.edges.filter(function (edge) {
            return edge.from === t.name;
        })
    );
};

DirectedGraph.prototype.getNode = function (id) {
    'use strict';
    return (
        this.nodes.filter(function (node) {
            return node.name === id;
        })[0]
    );
};

DirectedGraph.prototype.numNodes = function () {
    'use strict';
    return nodes.length;
};

DirectedGraph.prototype.getEdge = function (id) {
    'use strict';
    return (
        this.edges.filter(function (edge) {
            return edge.name === id;
        })[0]
    );
};

DirectedGraph.prototype.numEdges = function () {
    'use strict';
    return edges.length;
};

DirectedGraph.prototype.edges = function() {
    return edges;
};

DirectedGraph.prototype.isTerminal = function (node) {
    'use strict';
    return this.edgesOut(node).length === 0;
};

DirectedGraph.prototype.dfs = function (to_find, node, DirectedGraph) {
    'use strict';
    var t_1 = (typeof to_find === 'string') ? this.getNode(to_find) : to_find,
        t_2 = (typeof node === 'string') ? this.getNode(node) : node,
        edges_out = DirectedGraph.edgesOut(node),
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
        found = DirectedGraph.dfs(to_find, child, DirectedGraph);
        if (found) {
            return found;
        }
    }
    return null;
};

DirectedGraph.prototype.bfs = function (to_find, node, DirectedGraph) {
    'use strict';
    //work on this next
};

function hangingEdges(DirectedGraph, edges) {
    'use strict';
    var err = [],
        from,
        to;
    edges.forEach(function (edge) {
        var from = DirectedGraph.getNode(edge.from),
            to = DirectedGraph.getNode(edge.to);
        if (!from || !to) {
            err.push(edge);
        }
    });
    return err;
}

DirectedGraph.prototype.addNode = function(name, dt) {
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

DirectedGraph.prototype.addEdge = function(name, from, to, dt) {
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
    this.tDirectedGraph.add(from, to);
}

var count = 0;
// DirectedGraph.add('a', 'b', 'c', 'd');
DirectedGraph.prototype.add = function() {
    var nodes = [].slice.call(arguments, 0);
    for (var i = 0, len = nodes.length; i < len; i++) {
        //make the nodes if they don't exist and then make the edge from from and to
        if (!this.getNode(nodes[i])) {
            this.addNode(nodes[i]);
        }
        if (i > 0) {
            this.addEdge('_e' + count, nodes[i - 1], nodes[i]);
        }
        count++;
    }
}

DirectedGraph.prototype.tSort = function () {
    return this.tDirectedGraph.sort();
}

DirectedGraph.prototype.isAcyclic = function () {
    try {
        this.tDirectedGraph.sort();
    }
    catch(e) {
        return false;
    }
    return true;
}

/*
DirectedGraph.prototype.loadTasks = function() {
    //assumes all nodes are tasks with values as processes
    //next steps:
    //  allow for specific nodes to be considered
    //  allow for dependencies
    //  throw special errors!
    for(var i = 0; i<this.nodes.length; i++) {
        var n = this.nodes[i];
        var name = n.name;
        var data = n.data || null; // or (typeof data === "undefined") ? null : data;
        if(data != null && !orchestrator.hasTask(name)) {
            //we have a new task, so add it to orchestrator
            orchestrator.add(name, function() {
                exec(data, function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                      console.log('exec error: ' + error);
                    }
                });
            });
        }
    }
}
*/
/*
    you can now run tasks with
    orchestrator.start('thing1', 'thing2', function (err) {
        if(err) throw err;
        //done!
    });
*/

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

DirectedGraph.errors = {
    ValidationError: ValidationError
};

function DirectedGraph(struct) {
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

    this.tDirectedGraph = tsort();

    var test = validator.validate({nodes: this.nodes, edges: this.edges}, scheme),
        uq = areUq(this.edges, 'name'),
        x;

    if (test.errors.length > 0) {
        throw new ValidationError('Validation of DirectedGraph Failed: ', test.errors);
    }

    if (uq.length !== 0) {
        throw new ValidationError('Duplicate Edges Found: ', uq);
    }

    x = hangingEdges(this, this.edges);
    if (x.length !== 0) {
        throw new ValidationError('Hanging Edges Found: ', x);
    }

    //initial edge adding to tDirectedGraph
    for(var i = 0; i < this.edges.length; i++) {
        var x = this.edges[i];
        var fname = x.from;
        var tname = x.to;
        this.tDirectedGraph.add(fname, tname);
    }
}

/*******************************UG**************************************/

/*
 instead of edgesout and edgesin, need one function to get edges
*/
UndirectedGraph.prototype.getNode = function (id) {
    'use strict';
    return (
        this.nodes.filter(function (node) {
            return node.name === id;
        })[0]
    );
};

UndirectedGraph.prototype.numNodes = function () {
    'use strict';
    return nodes.length;
};

UndirectedGraph.prototype.getEdge = function (id) {
    'use strict';
    return (
        this.edges.filter(function (edge) {
            return edge.name === id;
        })[0]
    );
};

UndirectedGraph.prototype.getEdgeBetween = function (node1, node2) {
    return (
        this.edges.filter(function (edge) {
            return edge.between[0] === node1 && edge.between[1] === node2;
        })[0]
    );
};

UndirectedGraph.prototype.numEdges = function () {
    'use strict';
    return edges.length;
};

UndirectedGraph.prototype.edges = function() {
    return edges;
};

UndirectedGraph.prototype.addNode = function(name, dt) {
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

/*
important - edge structure is NOT the same as DAG
between is an array of two nodes- the nodes that the edges connect.
*/
UndirectedGraph.prototype.addEdge = function(name, n1, n2, dt) {
    //data (dt) is optional
    dt = (typeof dt === "undefined") ? null : dt;
    var nstr;
    if(dt === null) {
        nstr = {"name": name,"between": [n1, n2]};
    }
    else {
        nstr = {"name": name,"between": [n1, n2], "data" : dt};
    }
    this.edges.push(nstr);
}

var count = 0;
// UndirectedGraph.add('a', 'b', 'c', 'd');
UndirectedGraph.prototype.add = function() {
    var nodes = [].slice.call(arguments, 0);
    for (var i = 0, len = nodes.length; i < len; i++) {
        //make the nodes if they don't exist and then make the edge from from and to
        if (!this.getNode(nodes[i])) {
            this.addNode(nodes[i]);
        }
        if (i > 0) {
            this.addEdge('_e' + count, nodes[i - 1], nodes[i]);
        }
        count++;
    }
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

UndirectedGraph.errors = {
    ValidationError: ValidationError
};

// TODO: add validation of an UndirectedGraph
function UndirectedGraph(struct) {
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

    //need to add a scheme validator
    var uq = areUq(this.edges, 'name');

    if (uq.length !== 0) {
        throw new ValidationError('Duplicate Edges Found: ', uq);
    }
}

//module exports
module.exports.DirectedGraph = DirectedGraph;
module.exports.DG = DirectedGraph;
module.exports.UndirectedGraph = UndirectedGraph;
module.exports.UG = UndirectedGraph;

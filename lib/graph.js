/*global require, Graph, nodes, edges, module*/

var util = require('util');
var fs = require('fs');
var JSV = require('JSV').JSV;
var validator = JSV.createEnvironment();
var scheme = require('./scheme.json');
var PATH = null;

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

function writeJSON(json, output) {
    'use strict';
    fs.writeFile(output, JSON.stringify(json, null, 4), function (err) {
        if (err) {
            throw err;
            return 1;
        }
    });
    return 0;
}

Graph.prototype.testJSON = function () {
    'use strict';
    return writeJSON([1,2,3], 'c:/users/manan/desktop/test.json');
};

Graph.prototype.addNode = function(name) {
    
    /*using test_scheme.json because of current directory 
      issues
      
      Problem: Uncaught Error: ENOENT, open 'C:\Users\Manan\My Documents\github\test\test_scheme.json
    */
    
    PATH = '../test/test_scheme.json';
    var obj;
    fs.readFileSync(PATH, 'utf8', function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
    });
    
    var nstr = "{" + "name : " + name + "},";
    
    /*add the node to the nodes part of the JSON file here*/
};

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

function Graph(struct, path_name) {
    'use strict';
    if (!path_name) {
        throw new ValidationError('no path provided!');
    }
    /**this doesn't work, and I don't know why**/
    if (!struct) {
        var t_json = {
            "nodes" : [], 
            "edges" : []
        };
        var x = writeJSON(t_json, path_name + '/graph.json');
        console.log(x);
        // struct = require(path_name + '/graph.json');
        // path_name = path_name + '/graph.json';
    }
    
    PATH = path_name;
    var test = validator.validate(struct, scheme),
        uq = areUq(struct.edges, 'name'),
        x;
    
    if (test.errors.length > 0) {
        return new ValidationError('Validation of Graph Failed: ', test.errors);
    }
    
    /*
    if (uq.length !== 0) {
        return new ValidationError('Duplicate Nodes Found: ', uq);
    }
    */
    
    this.nodes = struct.nodes;
    
    if (uq.length !== 0) {
        return new ValidationError('Duplicate Edges Found: ', uq);
    }
    
    x = hangingEdges(this, struct.edges);
    if (x.length !== 0) {
        return new ValidationError('Hanging Edges Found: ', x);
    }
    
    this.edges = struct.edges;
}

module.exports = Graph;
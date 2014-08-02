/**
 * According to the schema, we have 
 *  A -> B -> C
 *
 * Simple tests for functionality (so nothing breaks when a new feature is added)
**/
/*global require, describe, before, it*/

var assert = require('assert');
var Graph = require('../lib/graph.js');
var ts = require('./test_scheme.json');

describe('Graph Creation', function () {
    'use strict';
    var t_graph = null;
    before(function () {
        t_graph = new Graph(ts, './test_scheme.json');
    });
    
    /*it('writes to a JSON file', function () {
        var x = t_graph.testJSON();
        t_graph.addNode();
        assert(x === 0);
    });*/

    it('Edges and Nodes Exist', function () {
        assert(t_graph);
        assert(t_graph.nodes);
        assert(t_graph.edges);
    });

    it('Find Nodes and Edges by Name', function () {
        var node = t_graph.getNode('C'), edge = t_graph.getEdge('BC');
        assert(typeof node === "object");
        assert(node.name === "C");
        assert(node.data === "__DATA__");
        
        assert(typeof edge === "object");
        assert(edge.from === "B");
        assert(edge.to === "C");
        assert(edge.name === "BC");
    });

    it('Get edges leaving from node', function () {
        var x = t_graph.edgesOut('A');
        assert(x[0].to === 'B');
    });

    it('Get edges entering node', function () {
        var x = t_graph.edgesIn('B');
        assert(x[0].from === 'A');
    });

    it('Determine terminal nodes', function () {
        assert(t_graph.isTerminal('T'));
    });

    it('Tests DFS', function () {
        assert(t_graph.dfs('B', 'A', t_graph) === t_graph.getNode('B'));
        assert(t_graph.dfs('dne', 'A', t_graph) === null);
    });
});
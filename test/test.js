/**
 * According to the schema, we have 
 *  A -> B -> C
 *
 * Simple tests for functionality (so nothing breaks when a new feature is added)
**/

var assert = require('assert');
var graph = require('../lib/graph.js');
var ts = require('./test_scheme.json');

describe('Graph Creation', function () {
    var graph_ = null;
    before(function () {
        graph_ = new graph(ts);
    });

    it('Edges and Nodes Exist', function () {
        assert(graph_);
        assert(graph_.nodes);
        assert(graph_.edges);
    });

    it('Find Nodes and Edges by Name', function () {
        var node = graph_.getNode('C');
        assert(typeof node === "object");
        assert(node.name === "C");
        assert(node.data === "__DATA__");
        
        var edge = graph_.getEdge('BC');
        
        assert(typeof edge === "object");
        assert(edge.from === "B");
        assert(edge.to === "C");
        assert(edge.name === "BC");
    });

    it('Get edges leaving from node', function () {
        var x = graph_.edgesOut('A');
        assert(x[0].to === 'B');
    });

    it('Get edges entering node', function () {
        var x = graph_.edgesIn('B');
        assert(x[0].from === 'A');
    });

    it('Determine terminal nodes', function () {
        assert(graph_.isTerminal('T'));
    });

    it('Tests DFS', function() {
        assert(graph_.dfs('B', 'A', graph_) === graph_.getNode('B'));
        assert(graph_.dfs('dne', 'A', graph_) === null);
    });
});
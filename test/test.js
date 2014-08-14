/**
 * According to the schema, we have 
 *  A -> B -> C
 *
 * Simple tests for functionality (so nothing breaks when a new feature is added)
**/
/*global require, describe, before, it*/

var assert = require('assert');
var Graph = require('../lib/graph.js');
var fs = require('fs');
var ts = JSON.parse(fs.readFileSync('./test/test_scheme.json'));

describe('Graph Creation', function () {
    'use strict';
    var t_graph = null;
    before(function () {
        t_graph = new Graph(ts);
    });
    
    it('Can instantiate a graph with no structure', function () {
        var no_structure = new Graph();
        console.dir(no_structure);
    });
    
    it('Has edges and nodes', function () {
        assert(t_graph);
        assert(t_graph.nodes);
        assert(t_graph.edges);
    });
    
    it('Can add a node', function() {
        t_graph.addNode("XYZ");
    });
    
    it('Can add a node with data', function() {
        t_graph.addNode("DAT", "some data");
    });
    
    it('Can add an edge', function() {
        t_graph.addEdge("sample-edge", "A", "XYZ", "__DATA__");
    });
    
    it('Can add an adge without data', function() {
        t_graph.addEdge("B->XYZ", "B", "XYZ");
    });
    
    it('Can perform a topological sort', function () {
        var x = t_graph.tSort();
        assert (('' + x) === 'A,B,C,XYZ');
    });
    
    it('Will find acyclic graphs', function() {
        t_graph.addEdge('cyclic-edge', 'C', 'A');
        assert(t_graph.isAcyclic() === false);
    });
    
    it('Prints the structure of a graph after addition of nodes and edges', function() {
        console.dir(t_graph);
    });

    it('Can find nodes and edges by Name', function () {
        var node = t_graph.getNode('C'), edge = t_graph.getEdge('BC');
        assert(typeof node === "object");
        assert(node.name === "C");
        assert(node.data === "__DATA__");
        
        assert(typeof edge === "object");
        assert(edge.from === "B");
        assert(edge.to === "C");
        assert(edge.name === "BC");
    });

    it('Can get edges leaving from a node', function () {
        var x = t_graph.edgesOut('A');
        assert(x[0].to === 'B');
    });

    it('Can get edges entering a node', function () {
        var x = t_graph.edgesIn('B');
        assert(x[0].from === 'A');
    });

    it('Can determine terminal nodes', function () {
        assert(t_graph.isTerminal('T'));
        assert(!t_graph.isTerminal('A'));
    });

    it('Tests DFS', function () {
        assert(t_graph.dfs('B', 'A', t_graph) === t_graph.getNode('B'));
        assert(t_graph.dfs('dne', 'A', t_graph) === null);
    });
});
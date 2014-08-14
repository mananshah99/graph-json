var Graph = require('../lib/graph.js');
var ts = require('../test/test_scheme.json');

var g2 = new Graph(ts, '../test/test_scheme.json');
g2.testJSON();
var g = new Graph(null, 'c:/users/manan/desktop');
g.addNode("A");
g.addNode("B");
g.addEdge("AB", "A", "B", "X");
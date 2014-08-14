var Graph = require('../lib/graph.js');
var g2 = new Graph(require('../test/test_scheme.json'), '../test/test_scheme.json');
console.log(g2.testJSON());
var g = new Graph(null, 'c:/users/manan/desktop');
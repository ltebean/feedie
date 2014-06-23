##Usage

```javascript
var feed = require('../').init({
	host: '127.0.0.1',
	port: '6379',
	options: {},
	namespace: 'usergraph'
});

var graph = feed.graph;


graph.follow('ltebean', 'kael', function(err, res) {})
graph.follow('ltebean', 'spud', function(err, res) {})


feed.broadcastBy('kael', {
    action: 'new project',
    detail: 'add a package called blabla'
}, function() {})

feed.sendTo('ltebean', {
    action: 'follow',
    detail: 'some one follows you'
}, function() {})

feed.load('ltebean', 0, 10, function(err, res) {
    console.log("ltebean's feed: %s", JSON.stringify(res))
});

feed.load('spud', 0, 10, function(err, res) {
    console.log("spud's feed: %s", JSON.stringify(res))
});

```
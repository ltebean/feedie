var redis = require('redis');
var client = redis.createClient();

var feedie = require('../').initWithRedisClient({
    client: client,
    namespace: 'feedie',
    maxSize:5
});

var graph = require('user-graph').initWithRedisClient({
    client: client,
    namespace: 'feedie'
});

graph.user('ltebean').follow('kael', function(err, res) {});
graph.user('spud').follow('kael', function(err, res) {});


feedie.user('kael').event('broadcast').broadcast(function() {});
feedie.user('kael').event('to ltebean').sendTo('ltebean',function() {});


feedie.user('ltebean').feedList(1, 10, function(err, res) {
    console.log("ltebean's feed: %s", JSON.stringify(res))
});

feedie.user('spud').feedList(1, 10, function(err, res) {
    console.log("spud's feed: %s", JSON.stringify(res))
});
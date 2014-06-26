var async = require('async');
var Keys = require('../keys')

function Event(user, event, options) {
	this.user = user;
	this.event = event;
	this.client = options.client;
	this.graph = options.graph;
	this.maxSize=options.maxSize;
	this.keys = new Keys(options.namespace);
}

module.exports = Event;

Event.prototype.broadcast = function(cb) {
	var user = this.user;
	var event = this.event;
	var graph = this.graph;
	var keys = this.keys;
	var client = this.client;
	var maxSize = this.maxSize;
	async.waterfall([

			function getFollowers(done) {
				graph.user(user).followers(done);
			},
			function sendFeed(users, done) {
				if (!users || users.length == 0) {
					done();
				}
				var multi = client.multi();
				users.forEach(function(user) {
					multi.lpush(keys.feedKey(user), JSON.stringify(event));
					if (maxSize) {
						multi.ltrim(keys.feedKey(user), 0, maxSize - 1);
					}
				});
				multi.exec(function(err, replies) {
					done(err);
				});
			}
		],
		function(err, results) {
			cb && cb(err);
		});
}

Event.prototype.sendTo = function(target, cb) {
	var multi = this.client.multi();
	multi.lpush(this.keys.feedKey(target), JSON.stringify(this.event));
	if (this.maxSize) {
		multi.ltrim(this.keys.feedKey(target), 0, this.maxSize - 1);
	}
	multi.exec(function(err, res) {
		cb && cb(err);
	})
}
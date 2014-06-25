var async = require('async');

module.exports = function event(user, event, options) {
	var user = user;
	var event = event;
	var client = options.client;
	var graph = options.graph;
	var maxSize = options.maxSize;
	var keys = require('../keys')(options.namespace);

	return {
		broadcast: function(cb) {
			broadcast(cb);
		},
		sendTo: function(target, cb) {
			sendTo(target, cb);
		}
	}

	function broadcast(cb) {
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

	function sendTo(target, cb) {
		var multi = client.multi();
		multi.lpush(keys.feedKey(target), JSON.stringify(event));
		if (maxSize) {
			multi.ltrim(keys.feedKey(target), 0, maxSize - 1);
		}
		multi.exec(function(err, res) {
			cb && cb(err);
		})
	}

}
var async = require('async');
var event = require('./event');

module.exports = function user(user, options) {
	var user = user;
	var client = options.client;
	var keys = require('../keys')(options.namespace);

	return {
		event: function(feed) {
			return event(user, feed, options);
		},
		feedList: function(page, count, cb) {
			feedList(page, count, cb);
		}
	}

	function feedList(page, count, cb) {
		var start = (page - 1) * count;
		var end = page * count - 1;
		client.lrange(keys.feedKey(user), start, end, function(err, results) {
			cb && cb(err, results.map(function(res) {
				return JSON.parse(res);
			}));
		});
	}

}
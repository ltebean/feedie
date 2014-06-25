var async = require('async');
var Event = require('./event');
var Keys = require('../keys')

function User(user, options) {
	this.user = user;
	this.client = options.client;
	this.keys = new Keys(options.namespace);
	this.options = options;
}

module.exports = User

User.prototype.event = function(feed) {
	return new Event(this.user, feed, this.options);
}

User.prototype.feedList = function(page, count, cb) {
	var start = (page - 1) * count;
	var end = page * count - 1;
	this.client.lrange(this.keys.feedKey(this.user), start, end, function(err, results) {
		cb && cb(err, results.map(function(res) {
			return JSON.parse(res);
		}));
	});
}
var redis = require("redis");
var sf = require('string-format');
var async = require('async');

exports.init = function(config) {
	return new API({
		client: redis.createClient(config.port || 6379, config.host || 'localhost', config.options || {}),
		maxSize: config.maxSize,
		namespace: config.namespace
	});
}

exports.initWithRedisClient = function(config) {
	return new API({
		client: config.client,
		maxSize: config.maxSize,
		namespace: config.namespace
	});
}

function API(options) {
	this.client = options.client;
	this.namespace = options.namespace ? options.namespace + ':' : '';
	this.maxSize = options.maxSize;
	this.graph = require('user-graph').initWithRedisClient({
		client: this.client,
		namespace: options.namespace
	});
}

API.prototype.broadcastBy = function(user, feed, cb) {
	var self = this;
	async.waterfall([

			function getFollowers(done) {
				self.graph.getFollowers(user, done);
			},
			function sendFeed(users, done) {
				if (!users || users.length == 0) {
					done();
				}
				var multi = self.client.multi();
				users.forEach(function(user) {
					multi.lpush(self._feedKey(user), JSON.stringify(feed));

				});
				if (self.maxSize) {
					multi.ltrim(self._feedKey(user), 0, self.maxSize - 1);
				}
				multi.exec(function(err, replies) {
					done(err);
				});
			}
		],
		function(err, results) {
			cb && cb(err);
		});
}

API.prototype.sendTo = function(user, feed, cb) {
	var multi = this.client.multi()
	multi.lpush(this._feedKey(user), JSON.stringify(feed));
	if (this.maxSize) {
		multi.ltrim(this._feedKey(user), 0, this.maxSize - 1, done);
	}
	multi.exec(function(err,res){
		cb && cb(err);
	})

}
API.prototype.load = function(user, page, count, cb) {
	var start = (page - 1) * count;
	var end = page * count - 1;
	this.client.lrange(this._feedKey(user), start, end, function(err, results) {
		cb && cb(err, results.map(function(res) {
			return JSON.parse(res);
		}))
	})
}


API.prototype._feedKey = function(user, namespace) {
	return '{namespace}user:{user}:feed'.format({
		namespace: this.namespace,
		user: user
	});
}
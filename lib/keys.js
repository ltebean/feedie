var sf = require('string-format');

module.exports = function(n) {
	var namespace = n ? n + ':' : '';
	return {
		feedKey: function(user) {
			return '{namespace}user:{user}:feed'.format({
				namespace: namespace,
				user: user
			});
		}
	}
}
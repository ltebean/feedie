var sf = require('string-format');

module.exports = function(namespace) {
	return {
		feedKey: function(user) {
			return '{namespace}user:{user}:feed'.format({
				namespace: this.namespace,
				user: user
			});
		}
	}
}
var sf = require('string-format');

function Keys(namespace) {
	this.namespace = namespace ? namespace + ':' : '';
}

module.exports = Keys;

Keys.prototype.feedKey = function(user) {
	return '{namespace}user:{user}:feed'.format({
		namespace: this.namespace,
		user: user
	});
}
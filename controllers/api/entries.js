var
	Promise = require('bluebird'),
	Entry = require('../../models/entry'),
	responder = require('../../lib/responder');

module.exports = {
	index: index
};

function index(req, res) {
	Entry.findNBy(25, {})
		.then(responder.handleResponse(res))
		.catch(responder.handleError(res));
}
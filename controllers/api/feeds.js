var
  Promise = require('bluebird'),
  Feed = require('../../models/Feed'),
  responder = require('../../lib/responder');

module.exports = {
  index: index
};

function index(req, res) {
  Feed.findAll()
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}
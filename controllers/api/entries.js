var
  Promise = require('bluebird'),
  Entry = require('../../models/entry'),
  responder = require('../../lib/responder');

module.exports = {
  index: index
};

function index(req, res) {
  var
    offset = req.query.offset;

  Entry.findNBy(25, {}, offset)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}
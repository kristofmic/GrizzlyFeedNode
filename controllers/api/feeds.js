var
  Promise = require('bluebird'),
  Feed = require('../../models/feed'),
  responder = require('../../lib/responder');

module.exports = {
  index: index,
  create: create
};

function index(req, res) {
  Feed.findAll()
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}

function create(req, res) {
  var
    feedUrl = req.body.url;

  Feed.createOne(feedUrl)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}
var
  Feed = require('../models/feed'),
  responder = require('./responder');

module.exports = {
  authorize: authorize
};

function authorize(req, res, next) {
  var
    feedId = req.param('feedId');

  Feed.findBy({ _id: feedId })
    .then(verifyFeed)
    .catch(responder.handleError(res));

  function verifyFeed(feed) {
    if (!feed) { responder.handleError(res, 400, 'Feed not found.')(); }
    else {
      req.feed = feed;
      next();
    }
  }
}
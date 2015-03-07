var
  UserFeedEntry = require('../../models/user_feed_entry'),
  responder = require('../../lib/responder');

module.exports = {
  create: create
};

function create(req, res) {
  var
    user = req.user,
    entry = req.entry;

  return UserFeedEntry.createOne(user._id, entry._id)
    .then(responder.handleResponse(res, 201, 'Success'))
    .catch(responder.handleError(res));
}
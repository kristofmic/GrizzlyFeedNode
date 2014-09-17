var
  Promise = require('bluebird'),
  Feed = require('../../models/feed'),
  User = require('../../models/user'),
  Entry = require('../../models/entry'),
  userHelper = require('../../lib/user_helper'),
  _ = require('lodash'),
  responder = require('../../lib/responder');

module.exports = {
  create: create
};

function create(req, res) {
  var
    user = req.user,
    entry = req.entry;

  if (!user.entries[entry._id]) {
    user.entries[entry._id] = true;
  }

  user.markModified('entries');

  return User.updateOne(user)
    .then(responder.handleResponse(res, 201, 'Success'))
    .catch(responder.handleError(res));
}

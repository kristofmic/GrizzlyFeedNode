var
  Promise = require('bluebird'),
  Feed = require('../../models/feed'),
  User = require('../../models/user'),
  _ = require('lodash'),
  responder = require('../../lib/responder');

module.exports = {
  create: create,
  destroy: destroy
};

function create(req, res) {
  var
    feed = req.feed,
    user = req.user;

  addFeedToUser(verifyUserFeed(feed))
    .then(responder.handleResponse(res, 201, ['feeds']))
    .catch(responder.handleError(res));

  function verifyUserFeed(feed) {
    if (_.find(user.feeds, compareUserFeed)) {
      responder.handleError(res, 400, 'Feed already added to the user\'s feeds.')();
    }
    else {
      return feed;
    }

    function compareUserFeed(userFeedEntry) {
      return userFeedEntry.equals(feed._id);
    }
  }

  function addFeedToUser(feed) {
    user.feeds.push(feed._id);
    return User.updateOne(user);
  }
}

function destroy(req, res) {
  var
    feed = req.feed,
    user = req.user;

  removeFeedFromUser(verifyUserFeed(feed))
    .then(responder.handleResponse(res, 201, ['feeds']))
    .catch(responder.handleError(res));

  function verifyUserFeed(feed) {
    var
      index = _.findIndex(user.feeds, compareUserFeed);

    if (index === -1) {
      responder.handleError(res, 400, 'Feed is not part of the user\'s feeds.')();
    }
    else {
      return index;
    }

    function compareUserFeed(userFeedEntry) {
      return userFeedEntry.equals(feed._id);
    }
  }

  function removeFeedFromUser(index) {
    user.feeds.splice(index, 1);
    return User.updateOne(user);
  }
}
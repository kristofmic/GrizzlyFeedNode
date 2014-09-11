var
  Promise = require('bluebird'),
  Feed = require('../../models/feed'),
  User = require('../../models/user'),
  Entry = require('../../models/entry'),
  _ = require('lodash'),
  responder = require('../../lib/responder');

module.exports = {
  create: create,
  destroy: destroy,
  index: index,
  show: show
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
      return userFeedEntry._id.equals(feed._id);
    }
  }

  function addFeedToUser(feed) {
    user.feeds.push(feed);
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
      return userFeedEntry._id.equals(feed._id);
    }
  }

  function removeFeedFromUser(index) {
    user.feeds.splice(index, 1);
    return User.updateOne(user);
  }
}

function index(req, res) {
  var
    feeds = req.user.feeds;

  Promise.map(feeds, getEntry)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}

function show(req, res) {
  var
    feed = req.feed;

  getEntry(feed)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}

function getEntry(feed) {
  return Entry.findNBy(5, { _feed: feed._id })
    .then(addEntriesToFeed);

  function addEntriesToFeed(entries) {
    feed = feed.toObject();
    feed.entries = entries;
    return feed;
  }
}
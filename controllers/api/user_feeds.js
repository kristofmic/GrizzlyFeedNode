var
  Promise = require('bluebird'),
  Feed = require('../../models/feed'),
  User = require('../../models/user'),
  Entry = require('../../models/entry'),
  userHelper = require('../../lib/user_helper'),
  _ = require('lodash'),
  responder = require('../../lib/responder');

module.exports = {
  create: create,
  updatePositions: updatePositions,
  destroy: destroy,
  index: index
};

function create(req, res) {
  var
    feed = req.feed,
    user = req.user;

  addFeedToUser(verifyUserFeed(feed))
    .then(responder.handleResponse(res, 201, 'Success'))
    .catch(responder.handleError(res));

  function verifyUserFeed(feed) {
    if (_.find(user.feeds, compareUserFeed)) {
      responder.handleError(res, 400, 'Feed already added to the user\'s feeds.')();
    }
    else {
      return feed;
    }

    function compareUserFeed(userFeedItem) {
      return userFeedItem.feed.equals(feed._id);
    }
  }

  function addFeedToUser(feed) {
    var
      next = userHelper.findNextFeedPosition(user);

    user.feeds.push({
      userFeed: {
        row: next.row,
        col: next.col
      },
      feed: feed
    });

    return User.updateOne(user);
  }
}

function updatePositions(req, res) {
  var
    user = req.user;
    feeds = req.body.feeds;

  user.feeds = _.map(feeds, mapUserFeed);

  console.log(user.feeds);
  return User.updateOne(user)
    .then(responder.handleResponse(res, 200, 'Success'))
    .catch(responder.handleError(res));

  function mapUserFeed(userFeedItem) {
    return {
      userFeed: userFeedItem.userFeed,
      feed: userFeedItem.feed._id
    };
  }
}

function destroy(req, res) {
  var
    feed = req.feed,
    user = req.user;

  removeFeedFromUser(verifyUserFeed(feed))
    .then(responder.handleResponse(res, 200, 'Success'))
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

    function compareUserFeed(userFeedItem) {
      return userFeedItem.feed.equals(feed._id);
    }
  }

  function removeFeedFromUser(index) {
    var
      feedToRemove = user.feeds[index];

    user.feeds.splice(index, 1);

    _.each(user.feeds, updatePositions);

    return User.updateOne(user);

    function updatePositions(userFeedItem) {
      if (userFeedItem.col === feedToRemove.col && userFeedItem.row > feedToRemove.row) {
        userFeedItem.row -= 1;
      }
    }
  }
}

function index(req, res) {
  var
    feeds = req.user.feeds;

  Promise.map(feeds, populateFeeds)
    .map(populateFeedEntries)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));
}

function populateFeeds(userFeedItem) {
  return Feed.findBy({ _id: userFeedItem.feed })
    .then(addFeedToUserFeed);

  function addFeedToUserFeed(feed) {
    userFeedItem = userFeedItem.toObject();
    userFeedItem.feed = feed.toObject();
    return userFeedItem;
  }
}

function populateFeedEntries(userFeedItem) {
  return Entry.findNBy(userFeedItem.userFeed.entries, { _feed: userFeedItem.feed._id })
    .then(addEntriesToFeed);

  function addEntriesToFeed(entries) {
    userFeedItem.feed.entries = entries;
    return userFeedItem;
  }
}
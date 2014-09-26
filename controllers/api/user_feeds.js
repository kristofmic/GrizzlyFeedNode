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
  updateEntries: updateEntries,
  refresh: refresh,
  destroy: destroy,
  index: index
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

function updateEntries(req, res) {
  var
    user = req.user,
    feed = req.feed,
    entries = req.body.entries,
    feedIndex = _.findIndex(user.feeds, { feed: feed._id });

  user.feeds[feedIndex].userFeed.entries = entries;

  return User.updateOne(user)
    .then(getNewEntries)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));

  function getNewEntries() {
    var
      userFeedItem = user.feeds[feedIndex];
    userFeedItem = userFeedItem.toObject();
    userFeedItem.feed = feed.toObject();

    return populateFeedEntries(userFeedItem, user.entries);
  }
}

function destroy(req, res) {
  var
    feed = req.feed,
    user = req.user;

  removeFeedFromUser(verifyUserFeed(feed))
    .then(responder.handleResponse(res, 200, ['feeds']))
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

    _.each(user.feeds, updatePosition);

    return User.updateOne(user);

    function updatePosition(userFeedItem) {
      if (userFeedItem.col === feedToRemove.col && userFeedItem.row > feedToRemove.row) {
        userFeedItem.row -= 1;
      }
    }
  }
}

function index(req, res) {
  var
    user = req.user,
    feeds = user.feeds;

  Promise.map(feeds, populateFeeds)
    .map(resolveUserFeedEntries)
    .then(responder.handleResponse(res))
    .catch(responder.handleError(res));

  function resolveUserFeedEntries(userFeedItem) {
    return populateFeedEntries(userFeedItem, user.entries);
  }
}

function refresh(req, res) {
  var
    feeds = req.user.feeds,
    newEntries = {};

  Promise.map(feeds, populateFeeds)
    .map(refreshUserFeedItem)
    .each(transformFeedEntries)
    .then(responder.handleResponse(res, null, newEntries))
    .catch(responder.handleError(res));

  function transformFeedEntries(feedEntries) {
    _.chain(feedEntries)
      .sortBy('pubdate')
      .reverse()
      .each(transformFeedEntry);

    function transformFeedEntry(feedEntry) {
      newEntries[feedEntry._feed] = newEntries[feedEntry._feed] || [];
      newEntries[feedEntry._feed].push(feedEntry);
    }
  }

  function refreshUserFeedItem(userFeedItem) {
    return Feed.refreshOne(userFeedItem.feed)
      .then(limitEntries);

    function limitEntries(entries) {
      return _.first(entries, userFeedItem.userFeed.entries);
    }
  }
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

function populateFeedEntries(userFeedItem, userEntries) {
  return Entry.findNBy(userFeedItem.userFeed.entries, { _feed: userFeedItem.feed._id })
    .then(addEntriesToFeed);

  function addEntriesToFeed(entries) {
    userFeedItem.feed.entries = _.map(entries, resolveUserFeedEntry);
    return userFeedItem;

    function resolveUserFeedEntry(entry) {
      entry = entry.toObject();
      entry.visited = !!userEntries[entry._id];
      return entry;
    }
  }
}
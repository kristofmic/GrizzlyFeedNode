var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  handleDeferred = require('../lib/responder').handleDeferred,
  paramFilter = require('../lib/param_filter'),
  reader = require('../lib/rss_reader'),
  Entry = require('./entry'),
  schema,
  schemaKeys,
  feedSchema,
  Feed;

schema = {
  title: String,
  description: String,
  link: String,
  xmlurl: String,
  date: Date,
  pubdate: Date,
  author: String,
  language: String,
  image: {
    url: String,
    title: String
  },
  favicon: String,
  copyright: String,
  generator: String,
  categories: [String],
  updatedAt: Date
};
schemaKeys = _.keys(schema);
feedSchema = mongoose.Schema(schema);
Feed = mongoose.model('Feed', feedSchema);

Feed.findBy = findBy;
Feed.findAll = findAll;
Feed.createOne = createOne;
Feed.updateOne = updateOne;
Feed.refreshOne = refreshOne;

module.exports = Feed;

function findBy(params) {
  return findByPromise(params);

  function findByPromise(params) {
    var
      deferredPromise = new Promise(defer);

    params = paramFilter(schemaKeys, params);

    return deferredPromise;

    function defer(resolve, reject) {
      Feed.findOne()
        .where(params)
        .exec(handleDeferred(resolve, reject));
    }
  }
}

function findAll() {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    Feed.find()
      .exec(handleDeferred(resolve, reject));
  }
}

function createOne(url) {
  return reader(url)
    .then(saveFeedWithEntries);

  function saveFeedWithEntries(entries) {
    return saveFeed(entries.meta)
      .then(saveEntries);

    function saveFeed(meta) {
      var
        newFeed = new Feed();

      return updateOne(newFeed, meta);
    }

    function saveEntries(feed) {
      return Promise.map(entries, saveEntry)
        .then(resolveFeed);

      function saveEntry(entry) {
        return Entry.createOne(feed, entry);
      }

      function resolveFeed() {
        return feed;
      }
    }
  }
}

function refreshOne(feed) {
  return reader(feed.xmlurl)
    .then(saveEntries)
    .then(updateFeedTimestamp);

  function saveEntries(entries) {
    return Promise.map(entries, saveEntry)
      .filter(filterNullEntries);

    function filterNullEntries(entry) {
      return !!entry;
    }

    function saveEntry(entry) {
      return Entry.findBy({ guid: entry.guid })
        .then(verifyNewEntry);

      function verifyNewEntry(existingEntry) {
        if (!existingEntry) {
          return Entry.createOne(feed, entry);
        }
      }
    }
  }

  function updateFeedTimestamp(entries) {
    Feed.update({ _id: feed._id }, { $set: { updatedAt: Date.now()}}, function() {});
    return entries;
  }
}

function updateOne(feed, feedParams) {
  var
    deferredPromise = new Promise(defer);

  feedParams = paramFilter(schemaKeys, feedParams);

  return deferredPromise;

  function defer(resolve, reject) {
    _.extend(feed, feedParams);
    feed.updatedAt = Date.now();

    feed.save(handleDeferred(resolve, reject));
  }
}




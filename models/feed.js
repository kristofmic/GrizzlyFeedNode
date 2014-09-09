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
  entries: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Entry' }]
};
schemaKeys = _.keys(schema);
feedSchema = mongoose.Schema(schema);
Feed = mongoose.model('Feed', feedSchema);

Feed.findBy = findBy;
Feed.findAll = findAll;
Feed.createOne = createOne;

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
        deferredPromise = new Promise(defer);

      return deferredPromise;

      function defer(resolve, reject) {
        var
          feedParams = paramFilter(schemaKeys, meta),
          newFeed = new Feed(feedParams);

        newFeed.save(handleDeferred(resolve, reject));
      }
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






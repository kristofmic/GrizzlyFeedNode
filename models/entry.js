var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  handleDeferred = require('../lib/responder').handleDeferred,
  paramFilter = require('../lib/param_filter'),
  sanitizer = require('../lib/sanitizer'),
  kue = require('kue'),
  entriesQ = kue.createQueue({port: process.env.REDIS_PORT, host: process.env.REDIS_HOST}),
  schema,
  schemaKeys,
  entrySchema,
  Entry;

schema = {
  title: String,
  description: String,
  summary: String,
  link: String,
  origlink: String,
  permalink: String,
  date: Date,
  pubdate: Date,
  author: String,
  guid: {
    type: String,
    index: true,
    unique: true
  },
  comments: String,
  image: {
    url: String,
    title: String
  },
  categories: [String],
  source: {
    url: String,
    title: String
  },
  enclosures: [{
    url: String,
    type: String,
    length: String
  }],
  _feed: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Feed',
    index: true
  },
  similar: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Entry',
    index: true
  }
};
schemaKeys = _.keys(schema);
entrySchema = mongoose.Schema(schema);
Entry = mongoose.model('Entry', entrySchema);

Entry.createOne = createOne;
Entry.addSimilar = addSimilar;
Entry.findNBy = findNBy;
Entry.findBy = findBy;
Entry.findWithinDay = findWithinDay;

module.exports = Entry;

function findWithinDay() {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    var
      dayAgo = Date.now() - (3600000 * 24),
      query = {
        pubdate: {$gte: dayAgo}
      },
      sort = {
        pubdate: -1
      };

    Entry
      .find()
      .where(query)
      .sort({ pubdate: -1})
      .exec(handleDeferred(resolve, reject));
  }
}

function createOne(feed, entry) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise
    .then(addToQueue);

  function defer(resolve, reject) {
    var
      entryParams = paramFilter(schemaKeys, entry),
      newEntry = new Entry(entryParams);

    newEntry._feed = feed._id;
    newEntry.author = sanitizer.sanitizeText(newEntry.author);
    newEntry.title = sanitizer.sanitizeText(newEntry.title);
    newEntry.summary = sanitizer.sanitizeHtml(newEntry.summary);
    newEntry.description = sanitizer.sanitizeHtml(newEntry.description);

    newEntry.save(handleDeferred(resolve, reject));
  }

  function addToQueue(entry) {

    entriesQ.create('entry', {
      _id: entry._id,
      title: entry.title,
    }).save();

    return entry;
  }
}

function addSimilar(entryId, similarId) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    Entry.findOneAndUpdate({_id: entryId}, {$push: {similar: similarId}})
      .exec(handleDeferred(resolve, reject));
  }
}

function findNBy(limit, params, skip) {
  return findNByPromise(params);

  function findNByPromise(params) {
    var
      deferredPromise = new Promise(defer);

    params = paramFilter(schemaKeys, params);

    return deferredPromise;

    function defer(resolve, reject) {
      params = params || {};
      skip = skip || 0;

      Entry.find()
        .where(params)
        .skip(skip)
        .limit(limit)
        .sort({
          pubdate: -1
        })
        .exec(handleDeferred(resolve, reject));
    }
  }
}

function findBy(params) {
  return findByPromise(params);

  function findByPromise(params) {
    var
      deferredPromise = new Promise(defer);

    params = paramFilter(schemaKeys, params);

    return deferredPromise;

    function defer(resolve, reject) {
      Entry.findOne()
        .where(params)
        .exec(handleDeferred(resolve, reject));
    }
  }
}
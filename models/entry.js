var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  handleDeferred = require('../lib/responder').handleDeferred,
  paramFilter = require('../lib/param_filter'),
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
  guid: String,
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
  _feed : { type: mongoose.SchemaTypes.ObjectId, ref: 'Feed', index: true },
};
schemaKeys = _.keys(schema);
entrySchema = mongoose.Schema(schema);
Entry = mongoose.model('Entry', entrySchema);

Entry.createOne = createOne;
Entry.findNBy = findNBy;

module.exports = Entry;

function createOne(feed, entry) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    var
      entryParams = paramFilter(schemaKeys, entry),
      newEntry = new Entry(entryParams);

    newEntry._feed = feed._id;

    newEntry.save(handleDeferred(resolve, reject));
  }
}

function findNBy(limit, params) {
  return findNByPromise(params);

  function findNByPromise(params) {
    var
      deferredPromise = new Promise(defer);

    params = paramFilter(schemaKeys, params);

    return deferredPromise;

    function defer(resolve, reject) {
      Entry.find()
        .where(params)
        .limit(limit)
        .exec(handleDeferred(resolve, reject));
    }
  }
}





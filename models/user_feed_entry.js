var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  PromiseB = require('bluebird'),
  handleDeferred = require('../lib/responder').handleDeferred,
  UserFeedEntry,
  Model;

UserFeedEntry = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true
  },

  entryId: {
    type: Schema.ObjectId,
    required: true
  }
});

UserFeedEntry.index({
  userId: 1,
  entryId: 1
});

UserFeedEntry.statics.createOne = createOne;
UserFeedEntry.statics.fetchOne = fetchOne;

Model = mongoose.model('UserFeedEntry', UserFeedEntry);

module.exports = Model;

function fetchOne(userId, entryId) {
  return new PromiseB(defer);

  function defer(resolve, reject) {
    if (!userId || !entryId) return reject(new Error('User Id or Entry Id missing'));

    Model
      .findOne({userId: userId, entryId: entryId})
      .exec(handleDeferred(resolve, reject));
  }
}

function createOne(userId, entryId) {
  return new PromiseB(defer);

  function defer(resolve, reject) {
    var
      userFeedEntry;

    if (!userId || !entryId) return reject(new Error('User Id or Entry Id missing'));

    userFeedEntry = new Model({
      userId: userId,
      entryId: entryId
    });

    userFeedEntry.save(handleDeferred(resolve, reject));
  }
}
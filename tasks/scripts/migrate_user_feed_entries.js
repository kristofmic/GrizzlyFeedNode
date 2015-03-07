var
  User = require('../../models/user'),
  UserFeedEntry = require('../../models/user_feed_entry'),
  mongoConnect = require('../../models/mongo_connect'),
  _ = require('lodash'),
  PromiseB = require('bluebird'),
  findAllUsers = PromiseB.promisify(User.find).bind(User);

mongoConnect.connect();

findAllUsers()
  .each(createUserFeedEntries)
  .catch(function(err) {
    mongoConnect.disconnect();
  })
  .finally(function() {
    mongoConnect.disconnect();
  });

function createUserFeedEntries(user) {
  console.log('creating user feed entries for: ', user._id);
  return PromiseB.all(_.map(user.toObject().entries, createUserFeedEntry))
    .then(dropUserEntries);

  function createUserFeedEntry(val, entryId) {
    return UserFeedEntry.createOne(user._id, entryId);
  }

  function dropUserEntries() {
    user.entries = undefined;
    user.markModified('entries');
    return User.updateOne(user);
  }
}
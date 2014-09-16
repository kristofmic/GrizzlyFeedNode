var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  bcrypt = require('bcrypt'),
  handleDeferred = require('../lib/responder').handleDeferred,
  paramFilter = require('../lib/param_filter'),
  token = require('../lib/token'),
  Feed = require('./feed'),
  Entry = require('./entry'),
  schema,
  schemaKeys,
  userSchema,
  User;

schema = {
  email: { type: String, index: true, unique: true },
  password: String,
  isActive: Boolean,
  isVerified: Boolean,
  token: { type: String, sparse: true, unique: true },
  tokenExpiration: Date,
  emailVerificationToken: { type: String, sparse: true, unique: true },
  passwordResetToken: { type: String, sparse: true, unique: true },
  passwordResetTokenExpiration: Date,
  feeds: [{
    userFeed: {
      col: Number,
      row: Number,
      entries: { type: Number, default: 5 }
    },
    feed: { type: mongoose.SchemaTypes.ObjectId, ref: 'Feed' }
  }]
};
schemaKeys = _.keys(schema).concat('createdAt');
userSchema = mongoose.Schema(schema);
User = mongoose.model('User', userSchema);

User.findBy = findBy;
User.updateOne = updateOne;
User.createOne = createOne;
User.updatePassword = updatePassword;
User.hashPassword = hashPassword;
User.isValidPassword = isValidPassword;

module.exports = User;

function findBy(params) {
  return findByPromise(params)
    .then(appendCreatedAt);

  function findByPromise(params) {
    var
      deferredPromise = new Promise(defer);

    params = paramFilter(schemaKeys, params);

    return deferredPromise;

    function defer(resolve, reject) {
      User.findOne()
        .where(params)
        .exec(handleDeferred(resolve, reject));
    }
  }

  function appendCreatedAt(user) {
    if (user) { user.createdAt = user._id.getTimestamp(); }
    return user;
  }
}

function updateOne(user, userParams) {
  var
    deferredPromise = new Promise(defer);

  userParams = paramFilter(schemaKeys, userParams);

  return deferredPromise;

  function defer(resolve, reject) {
    _.extend(user, userParams);

    user.save(handleDeferred(resolve, reject));
  }
}

function createOne(email, password) {
  return hashPassword(password)
    .then(createWithHash);

  function createWithHash(passwordHash) {
    var
      newUser,
      deferredPromise = new Promise(defer);

    return deferredPromise;

    function defer(resolve, reject) {
      newUser = new User({
        email: email,
        password: passwordHash,
        isActive: true,
        isVerified: false,
        emailVerificationToken: token.create().token
      });

      newUser.save(handleDeferred(resolve, reject));
    }
  }
}

function updatePassword(user, password) {
  return hashPassword(password)
    .then(updateUser);

  function updateUser(passwordHash) {
    user.passwordResetToken = null;
    user.passwordResetTokenExpiration = null;
    return updateOne(user, { password: passwordHash });
  }
}

function hashPassword(password) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    bcrypt.genSalt(4, genHash);

    function genHash(err, salt) {
      if (err) { reject(err); }
      bcrypt.hash(password, salt, handleDeferred(resolve, reject));
    }
  }
}

function isValidPassword(password, hash) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    bcrypt.compare(password, hash, handleDeferred(resolve, reject));
  }
}



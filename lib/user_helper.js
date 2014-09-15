var
  _ = require('lodash'),
  User = require('../models/user'),
  responder = require('./responder');

module.exports = {
  authorize: authorize,
  findNextFeedPosition: findNextFeedPosition
};

function authorize(req, res, next) {
  var
    token = req.header('token');

  User.findBy({ token: token, tokenExpiration: { $gte: new Date() }})
    .then(authorizeUser)
    .catch(responder.handleError(res));

  function authorizeUser(user) {
    if (!user) { responder.handleError(res, 401, 'Token not found or expired.')(); }
    else {
      req.user = user;
      next();
    }
  }
}

function findNextFeedPosition(user) {
  var
    col = 0,
    row = 0,
    max = [
      row,
      row,
      row
    ],
    max0,
    max1,
    max2;

  _.each(user.feeds, findMaxes);

  max0 = max[0];
  max1 = max[1];
  max2 = max[2];

  if (max0 <= max1 && max0 <= max2) {
    col = 0;
    row = max0 + 1;
  }
  else if (max1 <= max2) {
    col = 1;
    row = max1 + 1;
  }
  else {
    col = 2;
    row = max2 + 1;
  }

  return { col: col, row: row };

  function findMaxes(userFeedItem) {
    if (userFeedItem.userFeed.row > max[userFeedItem.userFeed.col]) {
      max[userFeedItem.userFeed.col] = userFeedItem.userFeed.row;
    }
  }
}
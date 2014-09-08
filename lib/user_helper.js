var
  User = require('../models/user'),
  responder = require('./responder');

module.exports = {
  authorize: authorize
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
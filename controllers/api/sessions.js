var
  Promise = require('bluebird'),
  User = require('../../models/user'),
  responder = require('../../lib/responder'),
  mailer = require('../../lib/mailer'),
  tokens = require('../../lib/token');

module.exports = {
  create: create,
  destroy: destroy,
  show: show,
  forgotPassword: forgotPassword
};

function create(req, res) {
  var
    email = req.body.email,
    password = req.body.password;

  if (!email && !password) { res.json(400, 'Invalid email or password. Please try again.' ); }

  User.findBy({ email: email, isVerified: true, isActive: true })
    .then(verifyUser)
    .then(verifyPassword)
    .then(tokens.createSessionToken)
    .then(User.updateOne)
    .then(responder.handleResponse(res, 201, ['email', 'token', 'createdAt']))
    .catch(responder.handleError(res));

  function verifyUser(user) {
    return user ? user : Promise.reject('Invalid email or password. Please try again.');
  }

  function verifyPassword(user) {
    return User.isValidPassword(password, user.password)
      .then(resolveVerification);

    function resolveVerification(isValid) {
      return isValid ? user : Promise.reject('Invalid email or password. Please try again.');
    }
  }
}

function destroy(req, res) {
  var
    token = req.header('token');

  User.findBy({ token: token })
    .then(destroyToken)
    .then(responder.handleResponse(res, null, 'Success'))
    .catch(responder.handleError(res));

  function destroyToken(user) {
    var
      userParams;

    userParams = {
      token: null,
      tokenExpiration: null
    };

    return User.updateOne(user, userParams);
  }
}

function show(req, res) {
  var
    token = req.header('token');

  User.findBy({ token: token, tokenExpiration: { $gte: new Date() }})
    .then(sendResponse)
    .catch(responder.handleError(res));

  function sendResponse(user) {
    if (!user) { responder.handleError(res, 401, 'Token not found or expired.')(); }
    else { responder.handleResponse(res, null, ['email', 'token', 'createdAt'])(user); }
  }
}

function forgotPassword(req, res) {
  var
    email = req.body.email;

  User.findBy({ email: email, isVerified: true, isActive: true })
    .then(verifyUser)
    .then(tokens.createPasswordResetToken)
    .then(User.updateOne)
    .then(sendReset)
    .then(responder.handleResponse(res, null, 'Success'))
    .catch(responder.handleError(res));

  function verifyUser(user) {
    if (!user) { responder.handleResponse(res, null, 'Success')(); }
    else { return user; }
  }

  function sendReset(user) {
    var
      mailerOptions;

    mailerOptions = {
      from: 'Grizzly Feed <do-not-reply@grizzlyfeed.com>',
      to: email,
      subject: 'Grizzly Feed - Forgot Password',
      html: '<p>To reset your password, click <a href="http://localhost:3000/#/forgot_password/' +
            user.passwordResetToken +
            '">this link</a></p>' +
            '<br />' +
            '<p>If clicking the link does not work, you may copy and paste it directly into the browser window: ' +
            'http://localhost:3000/#/forgot_password/' + user.passwordResetToken + '</p>',
      text: 'To reset your password, click the following link: http://localhost:3000/#/forgot_password/' + user.passwordResetToken
    };

    return mailer.send(mailerOptions);
  }
}

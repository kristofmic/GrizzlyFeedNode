var
  Promise = require('bluebird'),
  _ = require('lodash'),
  User = require('../../models/user'),
  responder = require('../../lib/responder'),
  mailer = require('../../lib/mailer');

module.exports = {
  create: create,
  update: update,
  resetPassword: resetPassword,
  verifyEmail: verifyEmail
};

function create(req, res) {
  var
    email = req.body.email,
    password = req.body.password;

  if (!email && !password) {
    res.json(400, 'Missing email or password. Please try again.');
  }

  User.findBy({
    email: email
  })
    .then(verifyEmailUnique)
    .then(createUser)
    .then(sendVerification)
    .then(responder.handleResponse(res, 201, 'Success'))
    .catch(responder.handleError(res));

  function verifyEmailUnique(user) {
    if (user) {
      return Promise.reject('The email is already in use.');
    }
  }

  function createUser() {
    return User.createOne(email, password);
  }

  function sendVerification(user) {
    var
      mailerOptions;

    mailerOptions = {
      from: 'Grizzly Feed <do-not-reply@grizzlyfeed.com>',
      to: email,
      subject: 'Grizzly Feed - Email Verification',
      html: '<p>Click <a href="' + process.env.HOSTNAME + '/#/email_verification/' +
        user.emailVerificationToken +
        '">this link</a> to verify your email.</p>' +
        '<br />' +
        '<p>If clicking the link does not work, you may copy and paste it directly into the browser window: ' +
        process.env.HOSTNAME + '/#/email_verification/' + user.emailVerificationToken + '</p>',
      text: 'To verify your email, click the following link: ' + process.env.HOSTNAME + '/#/email_verification/' + user.emailVerificationToken
    };

    return mailer.send(mailerOptions);
  }

}

function update(req, res) {
  var
    password = req.body.password,
    newPassword = req.body.newPassword,
    updateParams = _.omit(req.body, ['token', 'tokenExpiration', 'isActive', 'isVerified', 'passwordResetToken', 'passwordResetTokenExpiration', 'password', 'newPassword', 'feeds']);

  updateUser(req.user)
    .then(responder.handleResponse(res, 201, ['email', 'token', 'createdAt', 'feeds', 'layout']))
    .catch(responder.handleError(res));

  function updateUser(user) {
    if (password && newPassword) {
      return updatePassword(user, password, newPassword);
    } else {
      return User.updateOne(user, updateParams);
    }
  }

  function updatePassword(user, password, newPassword) {
    return verifyPassword(user)
      .then(updateUserPassword);

    function verifyPassword(user) {
      return User.isValidPassword(password, user.password)
        .then(resolveVerification);

      function resolveVerification(isValid) {
        return isValid ? user : Promise.reject('Invalid password. Please try again.');
      }
    }

    function updateUserPassword(user) {
      return User.updatePassword(user, newPassword);
    }
  }
}

function verifyEmail(req, res) {
  var
    verificationToken = req.body.verificationToken;

  User.findBy({
    emailVerificationToken: verificationToken
  })
    .then(verifyUser)
    .then(User.updateOne)
    .then(responder.handleResponse(res, null, ['email']))
    .catch(responder.handleError(res));

  function verifyUser(user) {
    if (!user) {
      return Promise.reject();
    } else {
      user.emailVerificationToken = undefined;
      user.isVerified = true;

      return user;
    }
  }
}

function resetPassword(req, res) {
  var
    resetToken = req.body.resetToken,
    newPassword = req.body.password;

  User.findBy({
    passwordResetToken: resetToken,
    passwordResetTokenExpiration: {
      $gte: new Date()
    }
  })
    .then(updatePassword)
    .then(responder.handleResponse(res, null, 'Success'))
    .catch(responder.handleError(res));

  function updatePassword(user) {
    if (!user) {
      responder.handleError(res, null, 'The password reset token is invalid or has expired. Please try again.')();
    } else {
      return User.updatePassword(user, newPassword);
    }
  }
}
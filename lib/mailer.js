var
  Promise = require('bluebird'),
  nodemailer = require('nodemailer'),
  handleDeferred = require('./responder').handleDeferred,
  transporter;

transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'chris@grizzlyfeed.com',
    pass: process.env.MAILER_PASSWORD
  }
});

module.exports = {
  send: send
};

function send(options) {
  var
    deferredPromise = new Promise(defer);

  return deferredPromise;

  function defer(resolve, reject) {
    transporter.sendMail(options, handleDeferred(resolve, reject));
  }
}
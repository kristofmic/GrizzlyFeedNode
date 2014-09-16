var
  express = require('express'),
  router = express.Router(),
  users = require('./users'),
  sessions = require('./sessions'),
  feeds = require('./feeds'),
  userFeeds = require('./user_feeds'),
  userHelper = require('../../lib/user_helper');
  feedHelper = require('../../lib/feed_helper');

router.post('/users', users.create);
router.put('/users', userHelper.authorize, users.update);
router.put('/users/reset_password', users.resetPassword);
router.put('/users/verify_email', users.verifyEmail);

router.get('/session', userHelper.authorize, sessions.show);
router.post('/sessions/forgot_password', sessions.forgotPassword);
router.get('/sessions/forgot_password/:token', sessions.forgotPassword);
router.post('/sessions', sessions.create);
router.delete('/sessions', userHelper.authorize, sessions.destroy);

router.get('/feeds', userHelper.authorize, feeds.index);
router.post('/feeds', userHelper.authorize, feeds.create);

router.get('/user_feeds', userHelper.authorize, userFeeds.index);
router.post('/user_feeds', userHelper.authorize, feedHelper.authorize, userFeeds.create);
router.put('/user_feeds/positions', userHelper.authorize, userFeeds.updatePositions);
router.delete('/user_feeds/:feedId', userHelper.authorize, feedHelper.authorize, userFeeds.destroy);

module.exports = router;



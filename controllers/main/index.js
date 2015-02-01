var
  express = require('express'),
  router = express.Router();

router.get('/', get);
router.get('/health', health);

module.exports = router;

function get(req, res) {
  res.render('main/index');
}

function health(req, res) {
  res.send(200, {
    status: 'alive'
  });
}
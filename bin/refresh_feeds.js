#! /app/vendor/node/bin/node

var
  Feed = require('../models/feed');

Feed.refreshAll();
process.exit();
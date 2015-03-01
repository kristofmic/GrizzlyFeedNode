require('../../config/env');

var
  mongoose = require('mongoose'),
  _ = require('lodash'),
  refreshFeeds = require('./refresh_feeds'),
  intervals = {
    '60min': 3600000,
    '30min': 1800000,
    '15min': 900000,
    '1min': 60000
  },
  entryLikeness,
  workers = {};

module.exports = {
  start: start,
  stop: stop
};

function dbConnect() {
  if (!mongoose.connection.readyState) {
    console.log('Connecting to mongo...');
    mongoose.connect(process.env.DB_CONNECTION);
  }
}

function start() {
  dbConnect();

  console.log('Starting workers...');

  workers.refreshFeeds = setInterval(refreshFeeds, intervals['30min']);
  console.log('Refresh feeds worker started.');

  entryLikeness = require('./entry_likeness');
  console.log('Entry likeness worker started');
}

function stop() {
  console.log('Clearing workers...');
  _.each(workers, clearInterval);
  entryLikeness.stop();

  console.log('Disconnecting mongo...');
  mongoose.connection.close();

  console.log('Workers successfully stopped.');
}
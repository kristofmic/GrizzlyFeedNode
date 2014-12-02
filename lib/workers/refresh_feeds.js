#!/usr/bin/env node

var
  Feed = require('../../models/feed');

module.exports = refreshFeeds;

function refreshFeeds() {
  console.log('Refreshing all feeds...');
  Feed.refreshAll()
    .then(function() { console.log('All feeds refreshed.'); })
    .catch(function(err) { console.error('There was an error refreshing...', err || 'No error data.'); });
}
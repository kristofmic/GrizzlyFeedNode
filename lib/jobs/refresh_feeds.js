var
  Feed = require('../../models/feed'),
  schedule = require('node-schedule'),
  rule = new schedule.RecurrenceRule();

rule.minute = [30, 0];

module.exports = schedule.scheduleJob(rule, refreshFeeds);

function refreshFeeds() {
  Feed.refreshAll();
}
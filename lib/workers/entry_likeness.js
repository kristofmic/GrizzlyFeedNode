var
  kue = require('kue'),
  entriesQ = kue.createQueue({port: process.env.REDIS_PORT, host: process.env.REDIS_HOST}),
  Entry = require('../../models/entry'),
  Classifier = require('../classifier'),
  PromiseB = require('bluebird'),
  THRESHOLD = 0.2,
  entries = 0;

entriesQ.process('entry', processNewEntry);

module.exports = {
  stop: stop
};

function stop() {
  entriesQ.shutdown();
}

function processNewEntry(job, done) {
  var
    newEntry = job.data;

  Entry.findWithinDay()
    .each(classify)
    .catch(handleError)
    .finally(function() {
      entries++;
      console.log('entries processed: ' + entries);
      done();
      job.remove();
    });

  function classify(entry) {
    var
      jIndex;

    if (entry._id.toString() === newEntry._id.toString()) return;

    jIndex = new Classifier(newEntry.title, entry.title).jaccardIndex().value();

    console.log('classifying entry: ');
    console.log(newEntry.title);
    console.log(entry.title);
    console.log(jIndex);

    if (jIndex >= THRESHOLD) {
      PromiseB.join(Entry.addSimilar(entry._id, newEntry._id), Entry.addSimilar(newEntry._id, entry._id), function(){ })
        .catch(function() { }); // eat it
    }
  }

  function handleError(err) {
    console.error('error processing similar entries: ', err);
  }
}
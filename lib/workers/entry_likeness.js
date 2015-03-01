var
  Queue = require('../queue'),
  entriesQ = new Queue('entries'),
  Entry = require('../../models/entry'),
  Classifier = require('../classifier'),
  PromiseB = require('bluebird'),
  THRESHOLD = 0.2;

entriesQ.once('ready', function() {
  entriesQ.sub(processNewEntry);
});

module.exports = {
  stop: entriesQ.stop
};

function processNewEntry(newEntry, ack) {
  Entry.findWithinDay()
    .each(classify)
    .then(ack)
    .catch(handleError);

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
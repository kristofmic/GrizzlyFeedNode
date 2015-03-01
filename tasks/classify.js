var
  Classifier = require('../lib/text_concurrence').Classifier,
  c = new Classifier('Star Wars Rumor: Kingsman Star Taron Egerton Up For Young Han Solo', 'Rumor: Taron Egerton Is Your New Han Solo');

// console.log('setup done: ');
// console.log(c);
// console.log('mapping...');

// c.map();

// console.log('mapping done: ');
// console.log(c);
// console.log('vectorizing...');

// c.vectorize();

// console.log('vectorizing done: ');
// console.log(c);

console.log('euclidean distance: ', c.euclideanDistance().value());

console.log('jaccard index: ', c.jaccardIndex().value());
console.log('jaccard distance: ', c.jaccardDistance().value());

module.exports = c;
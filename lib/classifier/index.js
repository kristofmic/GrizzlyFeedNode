var
  pos = require('pos'),
  lexer = new pos.Lexer(),
  tagger = new pos.Tagger(),
  jaccard = require('jaccard'),
  euclidean = require('euclidean-distance'),
  _ = require('lodash'),
  allowedPOS = 'JJ JJR JJS NN NNP NNPS NNS RB RBR RBS VB VBD VBG VBN VBP VBZ';


function Classifier(string1, string2) {
  this.text = [string1, string2];
  this.dictionary = [{}, {}];
  this.vectors = [[], []];
  this.jIndex = 0;
  this.jDistance = 0;
  this.eDistance = 0;
  this._value = '';
}

Classifier.prototype.map = map;
Classifier.prototype.vectorize = vectorize;
Classifier.prototype.jaccardIndex = jaccardIndex;
Classifier.prototype.jaccardDistance = jaccardDistance;
Classifier.prototype.euclideanDistance = euclideanDistance;
Classifier.prototype.value = value;

module.exports = Classifier;

function value() {
  return this[this._value];
}

function euclideanDistance() {
  ensureVector.call(this);

  this.eDistance = euclidean(this.vectors[0], this.vectors[1]);

  this._value = 'eDistance';
  return this;
}

function jaccardIndex() {
  var
    keys1,
    keys2;

  ensureDictionary.call(this);

  keys1 = _.keys(this.dictionary[0]);
  keys2 = _.keys(this.dictionary[1]);

  this.jIndex = jaccard.index(keys1, keys2);
  this._value = 'jIndex';
  return this;
}

function jaccardDistance() {
  var
    keys1,
    keys2;

  ensureDictionary.call(this);

  keys1 = _.keys(this.dictionary[0]);
  keys2 = _.keys(this.dictionary[1]);

  this.jDistance = jaccard.distance(keys1, keys2);
  this._value = 'jDistance';
  return this;
}

function map() {
  _.chain(this.text)
   .map(normalize)
   .map(lexer.lex, lexer)
   .map(tagger.tag, tagger)
   .map(whitelist)
   .forEach(buildDictionary, this)
   .value();

  this._value = 'dictionary';
  return this;

  function normalize(text) {
    return text.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, ' ');
  }

  function whitelist(taggedWords) {
    return _.filter(taggedWords, predicate);

    function predicate(taggedWord) {
      var
        word = taggedWord[0],
        type = taggedWord[1];

      return allowedPOS.indexOf(type) > -1;
    }
  }

  function buildDictionary(taggedWords, i) {
    _.each(taggedWords, iteratee, this);

    function iteratee(taggedWord) {
      this.dictionary[i][taggedWord[0]] = this.dictionary[i][taggedWord[0]] || 0;
      this.dictionary[i][taggedWord[0]] += 1;
    }
  }
}

function vectorize() {
  var
    keys1,
    keys2;

  ensureDictionary.call(this);

  keys1 = _.keys(this.dictionary[0]);
  keys2 = _.keys(this.dictionary[1]);

  this.vectors.keys = _.union(keys1, keys2);

  _.each(this.vectors.keys, buildBOW, this);

  this._value = 'vectors';
  return this;

  function buildBOW(key) {
    this.vectors[0].push(this.dictionary[0][key] || 0);
    this.vectors[1].push(this.dictionary[1][key] || 0);
  }
}

function ensureVector() {
  if (_.isEmpty(this.vectors[0]) || _.isEmpty(this.vectors[1])) {
    this.vectorize();
  }
}

function ensureDictionary() {
  if (_.isEmpty(this.dictionary[0]) || _.isEmpty(this.dictionary[1])) {
    this.map();
  }
}
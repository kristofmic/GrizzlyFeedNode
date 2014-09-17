var
  Entry = require('../models/entry'),
  responder = require('./responder');

module.exports = {
  authorize: authorize
};

function authorize(req, res, next) {
  var
    entryId = req.param('entryId');

  Entry.findBy({ _id: entryId })
    .then(verifyEntry)
    .catch(responder.handleError(res));

  function verifyEntry(entry) {
    if (!entry) { responder.handleError(res, 400, 'Entry not found.')(); }
    else {
      req.entry = entry;
      next();
    }
  }
}
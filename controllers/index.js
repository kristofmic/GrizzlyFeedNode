module.exports = function routeHandler(app) {
  app.use('/', require('./main'));
  app.use('/api', require('./api'));

  app.get('/loaderio-da47e3a485e284d04007d1ab319cee87', function(req, res) {
    res.send('loaderio-da47e3a485e284d04007d1ab319cee87');
  });
};


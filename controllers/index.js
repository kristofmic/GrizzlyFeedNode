module.exports = function routeHandler(app) {
  app.use('/', require('./main'));
  app.use('/api', require('./api'));
};


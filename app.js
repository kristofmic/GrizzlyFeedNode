var
  env = require('./config/env'),
  express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  debug = require('debug')('GrizzlyFeed'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),

  jobs = require('./lib/jobs'),

  controllers = require('./controllers'),
  errors = require('./lib/errors'),

  app = express();

// db setup
mongoose.connect(process.env.DB_CONNECTION);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

controllers(app);
errors(app);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + app.get('port'));
});

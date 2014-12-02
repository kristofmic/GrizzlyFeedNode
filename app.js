require('./config/env');

var
  express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  debug = require('debug')('GrizzlyFeed'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),

  controllers = require('./controllers'),
  errors = require('./lib/errors'),

  app = express();

// db setup
mongoose.connect(process.env.DB_CONNECTION);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

controllers(app);
errors(app);

module.exports = app;
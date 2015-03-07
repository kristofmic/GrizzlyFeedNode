require('../config/env');

var
  mongoose = require('mongoose');

module.exports = {
  connect: dbConnect,
  disconnect: disconnect
};

function dbConnect() {
  if (!mongoose.connection.readyState) {
    console.log('Connecting to mongo...');
    mongoose.connect(process.env.DB_CONNECTION);
  }
}

function disconnect() {
  mongoose.connection.close();
}
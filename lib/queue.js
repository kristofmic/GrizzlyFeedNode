var
  jackrabbit = require('jackrabbit'),
  EventEmitter = require('events').EventEmitter;

function Queue(queueName) {
  var
    self = this;

  EventEmitter.call(this);

  this.queueName = queueName;
  this.queue = jackrabbit('amqp://localhost');

  this.queue.on('connected', function() {
    console.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
    ready();
  });

  this.queue.on('error', function(err) {
    console.log({ type: 'error', msg: err, service: 'rabbitmq' });
  });

  this.queue.on('disconnected', function() {
    console.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
    lost();
  });

  function ready() {
    self.queue.create(queueName, {}, onCreate);
  }

  function onCreate(err, instance, info) {
    if (err) return self.emit('error', err);
    self.emit('ready');
  }

  function lost() {
    self.emit('lost');
  }
}

Queue.prototype = Object.create(EventEmitter.prototype);
Queue.prototype.pub = pub;
Queue.prototype.sub = sub;
Queue.prototype.stop = stop;

module.exports = Queue;

function pub(data) {
  this.queue.publish(this.queueName, data);
}

function sub(handler) {
  this.queue.handle(this.queueName, handler);
}

function stop() {
  this.queue.ignore(this.queueName);
}
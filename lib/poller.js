var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Promise = require('bluebird');
var _ = require('lodash');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });

var ActivityTask = require('./activity-task');
var DecisionTask = require('./decision-task');
var RateLimiter = require('limiter').RateLimiter;

var pollFns = {
  activity: Promise.promisify(swf.pollForActivityTask, swf),
  decision: Promise.promisify(swf.pollForDecisionTask, swf)
};

var taskCreator = {
  activity: function(data) { return new ActivityTask(data); },
  decision: function(data) { return new DecisionTask(data); }
}

function emitTask(data) {
  if (data.taskToken) {
    this.emit('task', taskCreator[this.taskType](data)); 
  }
}

function recur() {
  this.polling = false;
  next.call(this);
}

function poll() {
  this.polling = true;
  this.removeToken(1)
    .thenReturn(this.params)
    .then(this.pollFn)
    .then(_.bind(emitTask, this))
    .then(_.bind(recur, this));
}

function next(action) {
  this.nextAction = (action || this.nextAction);
  if (this.polling) return;
  if (this.nextAction === 'start') poll.call(this);
}

function Poller(taskType, params, delay) {
  EventEmitter.call(this);
  this.params = params;
  this.taskType = taskType;
  this.pollFn = pollFns[this.taskType];
  this.removeToken = function(_) { return Promise.resolve(); };
  if (delay) {
    var limiter = new RateLimiter(1, delay);
    this.removeToken = Promise.promisify(limiter.removeTokens, limiter);
  }
}
util.inherits(Poller, EventEmitter);

Poller.prototype.start = function start() {
  next.call(this, 'start');
}

Poller.prototype.stop = function stop() {
  next.call(this, 'stop');
}

module.exports = Poller;

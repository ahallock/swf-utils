var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Promise = require('bluebird');
var RateLimiter = require('limiter').RateLimiter;
var ActivityTask = require('./activity-task');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var swfPollForActivityTask = Promise.promisify(swf.pollForActivityTask, swf);
var swfPollForDecisionTask = Promise.promisify(swf.pollForDecisionTask, swf);

function createTask(taskType, data) {
  if (taskType === 'activity') {
    return new ActivityTask(data); 
  } else {
    // TODO: decision task
  }
}

function emitTask(data) {
  if (data.taskToken) {
    this.emit('task', createTask(this.taskType, data));
  }
}

function recurse() {
  this.polling = false;
  next.call(this);
}

function poll() {
  this.polling = true;
  this.removeToken(1)
    .thenReturn(this.params)
    .then(this.pollFn)
    .then(_.bind(emitTask, this))
    .then(_.bind(recurse, this));
}

function next(action) {
  this.nextAction = (action || this.nextAction);
  if (this.polling) return;
  if (this.nextAction === 'start') poll.call(this);
}

function Poller(taskType, taskList, tokensPerInterval, interval) {
  EventEmitter.call(this); 
  this.polling = false;
  this.nextAction = null;
  this.taskType = taskType;
  this.taskList = taskList;
  this.removeToken;
  this.pollFn =
    this.taskType === 'activity' ? swfPollForActivityTask :  swfPollForDecisionTask;
  this.params = {
    domain: process.env.AWS_SWF_DOMAIN,
    taskList: {
      name: this.taskList
    }
  }
  if (tokensPerInterval) {
    var limiter = new RateLimiter(tokensPerInterval, interval);
    this.removeToken = Promise.promisify(limiter.removeTokens, limiter);
  } else {
    this.removeToken = function() { return Promise.resolve(); };
  }
}
util.inherits(Poller, EventEmitter);

Poller.prototype.start = function start() {
  next.call(this, 'start');
  return this;
}

Poller.prototype.stop = function stop() {
  next.call(this, 'stop');
  return this;
}

module.exports = {
  pollForActivity: function(taskList, tokensPerInterval, interval) {
    return new Poller('activity', taskList, tokensPerInterval, interval).start();
  }
};

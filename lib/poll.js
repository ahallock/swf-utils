var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
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

module.exports = function poll(taskType, params, delay) {
  var busy = false;
  var polling = false;
  var pollFn = pollFns[taskType];
  var emitter = new EventEmitter();
  var removeToken = function(_) { return Promise.resolve(); };
  if (delay) {
    var limiter = new RateLimiter(1, delay);
    removeToken = Promise.promisify(limiter.removeTokens, limiter);
  }

  function pollSwf() {
    if (busy) return;
    busy = true;
    return removeToken(1)
      .thenReturn(params)
      .then(pollFn)
      .then(function(data) {
        if (data.taskToken) {
          emitter.emit('task', taskCreator[taskType](data)); 
        }
      })
      .then(function() {
        busy = false;
        if (polling) {
          return pollSwf();
        } else {
          emitter.emit('end');
        }
      });
  }

  return {
    onTask: function(cb) {
      emitter.on('task', cb); 
    },
    onEnd: function(cb) {
      emitter.on('end', cb);
    },
    start: function() {
      polling = true;
      return pollSwf();
    },
    stop: function() {
      polling = false;
    }
  }
}

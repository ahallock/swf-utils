var Promise = require('bluebird');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });

var ActivityTask = require('./activity-task');
var DecisionTask = require('./decision-task');
var Bacon = require("baconjs").Bacon;
var RateLimiter = require('limiter').RateLimiter;

var pollFns = {
  activity: Promise.promisify(swf.pollForActivityTask, swf),
  decision: Promise.promisify(swf.pollForDecisionTask, swf)
};

var taskCreator = {
  activity: function(data) { return new ActivityTask(data); },
  decision: function(data) { return new DecisionTask(data); }
}

function poll(taskType, taskList, tokensPerInterval, interval) {
  var params = {
    domain: process.env.AWS_SWF_DOMAIN,
    taskList: {
      name: taskList
    }
  }
  var removeToken;
  if (tokensPerInterval) {
    var limiter = new RateLimiter(tokensPerInterval, interval);
    removeToken = Promise.promisify(limiter.removeTokens, limiter);
  } else {
    removeToken = function() { return Promise.resolve(); };
  }
  return Bacon.fromBinder(function(sink) {
    var polling = true;
    (function loop() {
      if (!polling) return;
      return removeToken(1)
        .thenReturn(params)
        .then(pollFns[taskType])
        .then(sink)
        .then(loop);
    })();
    return function(){
      polling = false;
    }
  })
  .filter(function(data) {
    return typeof(data.taskToken) !== 'undefined';
  })
  .map(function(data) {
    return taskCreator[taskType](data);
  });
}

module.exports = poll;

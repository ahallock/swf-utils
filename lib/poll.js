var Promise = require('bluebird');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });

var ActivityTask = require('./activity-task');
var Bacon = require("baconjs").Bacon;
var RateLimiter = require('limiter').RateLimiter;

var pollFns = {
  'activity': Promise.promisify(swf.pollForActivityTask, swf),
  'decision': Promise.promisify(swf.pollForDecisionTask, swf)
};

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
    if (taskType === 'activity') {
      return new ActivityTask(data); 
    }
  });
}

module.exports = poll;

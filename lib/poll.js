var Promise = require('bluebird');
var RateLimiter = require('limiter').RateLimiter;
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var swfPollForDecisionTask = Promise.promisify(swf.pollForDecisionTask, swf);
var swfPollForActivityTask = Promise.promisify(swf.pollForActivityTask, swf);

function poll(taskType, taskList, decide, tokensPerInterval, interval) {
  var removeToken;
  if (tokensPerInterval) {
    var limiter = new RateLimiter(tokensPerInterval, interval);
    removeToken = Promise.promisify(limiter.removeTokens, limiter);
  } else {
    removeToken = function() {
      return Promise.resolve();
    }
  }

  var swfPollFn =
    taskType === 'decision' ? swfPollForDecisionTask : swfPollForActivityTask;

  var params = {
    domain: process.env.AWS_SWF_DOMAIN,
    taskList: {
      name: taskList
    }
  }

  var loop = function() {
    return removeToken(1)
      .thenReturn(params)
      .then(swfPollFn)
      .then(function(data) {
        if (data.taskToken) {
          return decide(data);
        }
        return Promise.resolve();
      })
      .then(loop);
  }
  return loop();
}

module.exports = poll;

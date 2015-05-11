var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var Promise = require('bluebird');
var taskResponses = require('./task-responses');
var pollForDecisionTask = require('./poll-for-decision-task');
var swfPollForDecisionTask = Promise.promisify(swf.pollForDecisionTask, swf);
var R = require('ramda');

var pollEndpoints = {
  decision: function(params) {
    return pollForDecisionTask(params, [], swfPollForDecisionTask);
  },
  activity: Promise.promisify(swf.pollForActivityTask, swf)
}

var responseMap = R.reduce(function(acc, value) {
  acc[value] = Promise.promisify(swf['respond' + value], swf);
  return acc;
}, {}, R.keys(taskResponses));

var poll = function(pollFn, params, fn) {
  return pollFn(params)
    .then(function(task) {
      if (R.isNil(task.taskToken)) return Promise.resolve();
      return Promise.resolve(task)
        .then(fn)
        .then(function(res) {
          var responseFn = responseMap[res.constructor.name];
          return responseFn(R.merge({ taskToken: task.taskToken }, res));
        });
    });
}

module.exports = {
  pollDecisions: function(params, decide) {
    return poll(pollEndpoints.decision, params, decide);
  },
  pollActivities: function(params, handler) {
    return poll(pollEndpoints.activity, params, handler);
  }
}

var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var Promise = require('bluebird');
var _ = require('lodash');

var swfComplete = Promise.promisify(swf.respondActivityTaskCompleted, swf);
var swfFail = Promise.promisify(swf.respondActivityTaskFailed, swf);
var swfCancel = Promise.promisify(swf.respondActivityTaskCanceled, swf);
var swfRecordHeartbeat = Promise.promisify(swf.recordActivityTaskHeartbeat, swf);
 
function ActivityTask(data) {
  _.merge(this, data);
}

ActivityTask.prototype.complete = function complete(result) {
  return swfComplete({
    taskToken: this.taskToken,
    result: result
  });
};

ActivityTask.prototype.fail = function fail(details, reason) {
  return swfFail({
    taskToken: this.taskToken,
    details: details,
    reason: reason
  });
};

ActivityTask.prototype.cancel = function cancel(details) {
  return swfCancel({
    taskToken: this.taskToken,
    details: details
  });
}

ActivityTask.prototype.recordHeartbeat = function recordHeartbeat(details) {
  return swfRecordHeartbeat({
    taskToken: this.taskToken,
    details: details
  });
}

module.exports = ActivityTask;

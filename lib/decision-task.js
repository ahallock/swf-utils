var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var Promise = require('bluebird');
var _ = require('lodash');

function DecisionTask(data) {
  _.merge(this, data);
}

module.exports = DecisionTask;


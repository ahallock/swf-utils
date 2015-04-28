var Promise = require('bluebird');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var pollForDecisionTask = Promise.promisify(swf.pollForDecisionTask, swf);
var R = require('ramda');

// external api calls
var fetchEvents = function fetchEvents(params, events) {
  if (!params.nextPageToken) return Promise.resolve(events);
  return pollForDecisionTask(params)
    .then(function(res) {
      return fetchEvents(
        R.merge(params, { nextPageToken: res.nextPageToken }),
        events.concat(res.events)
      );
    }); 
}

var activities = {
  complete: Promise.promisify(swf.respondActivityTaskCompleted, swf),
  fail: Promise.promisify(swf.respondActivityTaskFailed, swf),
  cancel: Promise.promisify(swf.respondActivityTaskCanceled, swf)
};


function flow(decisionTask, config, workflow) {
  var decisions = workflow(decisionTask, config);
  respond(decisions); 
}


// entry points
function DecisionTask(decisionTask, workflow) {
  var decideFn = R.curry(decide)(workflow);
  return fetchEvents(decisionTask, decisionTask.events)
    .then(eventHistory.getNewEvents)
    .then(decideFn)
    .then(function() {
    
    })
}

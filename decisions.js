var R = require('ramda');

module.exports = {
  scheduleActivityTask: function(attrs) {
    return {
      decisionType: 'ScheduleActivityTask',
      scheduleActivityTaskDecisionAttributes: attrs
    }
  },
  completeWorkflow: function(result) {
    var attrs = R.isNil(result) ? {} : { result: result };
    return {
      decisionType: 'CompleteWorkflowExecution',
      completeWorkflowExecutionDecisionAttributes: attrs
    }
  }
}

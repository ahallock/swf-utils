var expect = require('expect.js');
var filterEvents = require('../filter-events');
var events = require('./events');
var R = require('ramda');

describe('filter events', function() {
  it('returns failed activites', function() {
    var failed = filterEvents.failedActivities(events);
    var groups = R.countBy(R.prop('eventType'), failed);
    expect(groups['ActivityTaskFailed']).to.be(1);
    expect(groups['ActivityTaskTimedOut']).to.be(1);
  });
  it('returns workflow execution started', function() {
    var workflowStarted = filterEvents.workflowExecutionStarted(events);
    expect(workflowStarted.length).to.be(1);
    expect(workflowStarted[0].eventType).to.be('WorkflowExecutionStarted');
  });
  it('returns completed activities', function() {
    var completed = filterEvents.completedActivities(events);
    expect(completed.length).to.be(1);
    expect(completed[0].eventType).to.be('ActivityTaskCompleted');
  });
  it('returns new events', function() {
    var filterNew = filterEvents.newEvents(events.length - 2);
    expect(filterNew(events).length).to.be(2);
  });
  it('returns activities in progress', function() {
    var inProgress = filterEvents.inProgress(events);
    expect(inProgress.length).to.be(1);
  });
});



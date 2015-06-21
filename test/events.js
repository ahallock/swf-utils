var R = require('ramda');

module.exports = R.reverse([
  {
    eventId: 8,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity3',
      activityType: { name: 'type3', version: '1' }
    }
  },  
  {
    eventId: 7,
    eventType: 'ActivityTaskTimedOut',
    activityTaskTimedOutEventAttributes: {
      scheduledEventId: 4
    }
  },  
  {
    eventId: 6,
    eventType: 'ActivityTaskCompleted',
    activityTaskCompletedEventAttributes: {
      scheduledEventId: 5
    }
  },
  {
    eventId: 5,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity1',
      activityType: { name: 'type1', version: '1' }
    }
  },  
  {
    eventId: 4,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity2',
      activityType: { name: 'type2', version: '1' }
    }
  },  
  {
    eventId: 3,
    eventType: 'ActivityTaskFailed',
    activityTaskFailedEventAttributes: {
      scheduledEventId: 2
    }
  },  
  {
    eventId: 2,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity1',
      activityType: { name: 'type1', version: '1' }
    }
  },
  {
    eventId: 1,
    eventType: 'WorkflowExecutionStarted',
    workflowExecutionStartedEventAttributes: {
      input: 'workflow input'
    }
  }  
]);


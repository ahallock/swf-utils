module.exports = [
  {
    eventId: 8,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity3',
      activityType: 'type3'
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
      activityType: 'type1'
    }
  },  
  {
    eventId: 4,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity2',
      activityType: 'type2'
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
      activityType: 'type1'
    }
  },
  {
    eventId: 1,
    eventType: 'WorkflowExecutionStarted',
    workflowExecutionStartedEventAttributes: {
      input: 'workflow input'
    }
  }  
];


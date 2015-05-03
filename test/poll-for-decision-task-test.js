process.env.AWS_DEFAULT_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = '123';
process.env.AWS_SECRET_ACCESS_KEY = 'abc';

var Promise = require('bluebird');
var AWS = require('aws-sdk');
var swf = new AWS.SWF({ region: process.env.AWS_DEFAULT_REGION });
var swfPollForDecisionTask = Promise.promisify(swf.pollForDecisionTask, swf);
var expect = require('expect.js');
var nock = require('nock');
var R = require('ramda');
var pollForDecisionTask = require('../lib/poll-for-decision-task');

describe('swf api helpers', function() {
  after(function(done) {
    nock.cleanAll();
    done();
  });

  describe('.pollForDecisionTask', function() {
    it('fetches all events', function(done) {
      var params = {
        domain: 'test-domain',
        taskList: {
          name: 'test-task-list'
        }
      }  
      nock('https://swf.us-east-1.amazonaws.com')
        .matchHeader('X-Amz-Target',
          'SimpleWorkflowService.PollForDecisionTask')
        .post('/', params)
        .reply(200, {
          events: [
            {
              eventId: 1,
              eventType: 'WorkflowExecutionStarted'
            }
          ],
          taskToken: '123',
          nextPageToken: 'page2'
        });
      nock('https://swf.us-east-1.amazonaws.com')
        .matchHeader('X-Amz-Target',
          'SimpleWorkflowService.PollForDecisionTask')
        .post('/', R.merge(params, { nextPageToken: 'page2' }))
        .reply(200, {
          events: [
            {
              eventId: 2,
              eventType: 'ScheduleActivityTask'
            }
          ],
          taskToken: '123'
        });
        
        pollForDecisionTask(params, [], swfPollForDecisionTask)
          .then(function(decisionTask) {
            expect(decisionTask).to.eql({
              events:
                [ { eventId: 1, eventType: 'WorkflowExecutionStarted' },
                  { eventId: 2, eventType: 'ScheduleActivityTask' } ],
              taskToken: '123' 
            });
            done();
          });
    });
  });

});

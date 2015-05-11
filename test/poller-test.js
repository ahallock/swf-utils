process.env.AWS_DEFAULT_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = '123';
process.env.AWS_SECRET_ACCESS_KEY = 'abc';

var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');
var poller = require('../poller');
var taskResponses = require('../task-responses');
var R = require('ramda');

var activityResponses = {
  fail: {
    action: 'RespondActivityTaskFailed',
    params: { details: 'failed details', reason: 'failed reason' },
    cb: function(activity) {
      return new taskResponses.ActivityTaskFailed(
        'failed details', 'failed reason');
    }
  },
  complete: {
    action: 'RespondActivityTaskCompleted',
    params: { result: 'completed result' },
    cb: function(activity) {
      return new taskResponses.ActivityTaskCompleted('completed result');
    }
  },
  cancel: {
    action: 'RespondActivityTaskCanceled',
    params: { details: 'canceled details' },
    cb: function(activity) {
      return new taskResponses.ActivityTaskCanceled('canceled details');
    }
  }
};

var params = {
  domain: 'test-domain',
  taskList: {
    name: 'test-task-list'
  }
}

function nockActivity(reply) {
  nock('https://swf.us-east-1.amazonaws.com')
    .matchHeader('X-Amz-Target',
      'SimpleWorkflowService.PollForActivityTask')
    .post('/', params)
    .reply(200, reply);
}

function nockRespond(respondWith, requestParams) {
  nock('https://swf.us-east-1.amazonaws.com')
    .matchHeader('X-Amz-Target',
      'SimpleWorkflowService.'+respondWith)
    .post('/', requestParams)
    .reply(200);
}

function handleActivityTask(type) {
  var res = activityResponses[type];
  nockActivity({
    taskToken: '123',
    activityId: 'activity1'
  });

  nockRespond(res.action, R.merge({
    taskToken: '123'
  }, res.params));
  
  return poller.pollActivities(params, res.cb);
}

describe('poller', function() {
  afterEach(function() {
    nock.cleanAll();
  });
  context('when no task token', function() {
    it('does not invoke callback', function(done) {
      var spy = sinon.spy();
      nockActivity({});
      poller.pollActivities(params, spy).then(function() {
        expect(spy.called).not.to.be.ok();
        done();
      });
    });
  })
  describe('#pollActivities', function() {
    it('completes the activity', function(done){
      handleActivityTask('complete').then(function() { done(); })
    });
    it('fails the activity', function(done){
      handleActivityTask('fail').then(function() { done(); })
    });
    it('cancels the activity', function(done){
      handleActivityTask('cancel').then(function() { done(); })
    });
  });
  describe('#pollDecisions', function() {
    it('completes the decision', function(done){
        nock('https://swf.us-east-1.amazonaws.com')
          .matchHeader('X-Amz-Target',
            'SimpleWorkflowService.PollForDecisionTask')
          .post('/', params)
          .reply(200, {
            taskToken: '123',
            events: []
          });
        nockRespond('RespondDecisionTaskCompleted', R.merge({
          taskToken: '123'
        }, { decisions: [] }));
        
        var callback = function(task) {
          return new taskResponses.DecisionTaskCompleted([]);
        }
        poller.pollDecisions(params, callback).then(function() { done(); });
    });
  });
});

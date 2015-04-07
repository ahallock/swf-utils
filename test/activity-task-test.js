var expect = require('expect.js');
var nock = require('nock');

process.env.AWS_DEFAULT_REGION = 'us-east-1';
process.env.AWS_SWF_DOMAIN = 'domain';
process.env.AWS_ACCESS_KEY_ID = '123';
process.env.AWS_SECRET_ACCESS_KEY = 'abc';

var ActivityTask = require('../lib/activity-task');
var Promise = require('bluebird');

var task = new ActivityTask({ taskToken: '123' });

function setupNock(target, params) {
  nock('https://swf.us-east-1.amazonaws.com')
    .persist()
    .matchHeader('X-Amz-Target', target)
    .post('/', params)
    .reply(200);
}

describe('ActivityTask', function() {
  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe('#complete', function() {

    it('completes the task', function(done) {
      setupNock('SimpleWorkflowService.RespondActivityTaskCompleted', {
        taskToken: task.taskToken,
        result: 'complete details'   
      });
      task.complete('complete details').then(function(){ done(); }).catch(done);
    });

    it('cancels the task', function(done) {
      setupNock('SimpleWorkflowService.RespondActivityTaskCanceled', {
        taskToken: task.taskToken,
        details: 'cancel details',
      });
      task.cancel('cancel details').then(function(){ done(); }).catch(done);
    });

    it('fails the task', function(done) {
      setupNock('SimpleWorkflowService.RespondActivityTaskFailed', {
        taskToken: task.taskToken,
        details: 'fail details',
        reason: 'fail reason'
      });
      task.fail('fail details', 'fail reason')
        .then(function(){ done(); }).catch(done);
    });

    it('records heartbeat', function(done) {
      setupNock('SimpleWorkflowService.RecordActivityTaskHeartbeat', {
        taskToken: task.taskToken,
        details: 'heartbeat'   
      });
      task.recordHeartbeat('heartbeat').then(function(){ done(); }).catch(done);
    });

  });
});


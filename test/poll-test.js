var expect = require('expect');
var nock = require('nock');

process.env.AWS_DEFAULT_REGION = 'us-east-1';
process.env.AWS_SWF_DOMAIN = 'domain';
process.env.AWS_ACCESS_KEY_ID = '123';
process.env.AWS_SECRET_ACCESS_KEY = 'abc';

var poll = require('../lib/poll');
var Promise = require('bluebird');

function setupNock(taskType) {
  taskType || (taskType = 'activity')
  var amzTargetHeader;
  if (taskType === 'activity') {
    amzTargetHeader = 'SimpleWorkflowService.PollForActivityTask';
  } else {
    amzTargetHeader = 'SimpleWorkflowService.PollForDecisionTask';
  }
  nock('https://swf.us-east-1.amazonaws.com')
    .persist()
    .matchHeader('X-Amz-Target', amzTargetHeader)
    .filteringRequestBody(function(path) {
      return '*';
    })
    .post('/', '*')
    .reply(200);
}

describe('poller', function() {
  beforeEach(function(done) {
    setupNock();
    done();
  });

  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe('#poll', function() {
    it('calls the decide function', function(done) {
      function decide() {
        return new Promise(function(resolve) {
          setImmediate(function() {
            resolve();
            done();
          });
        });
      }

      var p = poll('activity', 'task-list', decide)
        .cancellable()
        .catch(Promise.CancellationError, function(e){})
        .cancel();
    });

    it('rate limits decide calls', function(done) {
      var counter = 0;
      function decide() {
        return new Promise(function(resolve) {
          setImmediate(function() {
            counter++;
            resolve();
          });
        });
      }

      var p = poll('activity', 'task-list', decide, 1, 250)
        .cancellable()
        .catch(Promise.CancellationError, function(e){});

      expect(counter).toBe(0);
      setTimeout(function() {
        expect(counter).toBe(2);
        p.cancel();
        done();
      }, 500);
    });

    it('polls for decision tasks', function(done) {
      nock.cleanAll();
      setupNock('decision');
      var p = poll('decision', 'task-list', function(){ p.cancel(); })
        .cancellable()
        .catch(Promise.CancellationError, function(e){});
      done();
    });
  });
});

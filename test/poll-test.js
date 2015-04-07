require('./helper');
var expect = require('expect.js');
var nock = require('nock');
var poll = require('../lib/poll');

describe('Poller', function() {
  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  describe('#pollForActivity', function() {
    it('emits activity data', function(done) {
      nock('https://swf.us-east-1.amazonaws.com')
        .matchHeader('X-Amz-Target', 'SimpleWorkflowService.PollForActivityTask')
        .post('/', {
          domain: 'domain',
          taskList: {
            name: 'mylist' 
          }
        })
        .reply(200, {
          taskToken: '123'   
        });
      var unsub = poll('activity', 'mylist')
        .onValue(function(task) {
          expect(task.taskToken).to.eql('123');
          unsub();
          done();
        });
    });
  });
});

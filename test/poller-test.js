require('./helper');
var expect = require('expect.js');
var nock = require('nock');
var sinon = require('sinon');
var poller = require('../lib/poller');

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
      var p = poller.pollForActivity('mylist');
      p.on('task', function(task) {
        expect(task.taskToken).to.eql('123');
        p.stop();
        done();
      }); 
    });
  });
});

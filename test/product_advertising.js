var should = require('should');
var awskit = require('../');

var api = new awskit.ProductAdvertising({ key: 'testKey', tag: 'testTag', https: true });

describe('awskit.ProductAdvertising', function () {
  describe('#constructor()', function () {
    it('should return an object', function () {
      api.should.be.a('object');
    });
  });
  describe('#buildRequestUrl()', function () {
    it('should return a string', function () {
      var url = api.buildRequestUrl();
      url.should.be.a('string');
      // console.log(url);
    });
  });
});
var should = require('should');
var products = require('../').ProductAdvertising;

var api = new products.Client({ key: 'testKey', tag: 'testTag', https: true });

describe('products.Client', function () {
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
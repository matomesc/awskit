/**
 * wrapper for amazon's product advertising api
 *
 * Copyright(c) 2012 Mihai Tomescu <matomesc@gmail.com>
 * MIT Licensed
 */

var url = require('url');

var request = require('request');
var xml2js = require('xml2js');
var inspect = require('eyes').inspector({ maxLength: false });

var ENDPOINTS = {
  CA: 'ecs.amazonaws.ca/onca/xml',
  CN: 'webservices.amazon.cn/onca/xml',
  DE: 'ecs.amazonaws.de/onca/xml',
  ES: 'webservices.amazon.es/onca/xml',
  FR: 'ecs.amazonaws.fr/onca/xml',
  IT: 'webservices.amazon.it/onca/xml',
  JP: 'ecs.amazonaws.jp/onca/xml',
  UK: 'ecs.amazonaws.co.uk/onca/xml',
  US: 'webservices.amazon.com/onca/xml'
};

var OPERATIONS = [
  // find items
  'ItemSearch',
  'SimilarityLookup',
  // find out more about an item
  'ItemLookup',
  // shopping cart
  'CartCreate',
  'CartAdd',
  'CartModify',
  'CartClear',
  'CartGet',
  // other
  'BrowseNodeLookup'
];

//
// exports
//

module.exports = ProductAdvertising;

var parser = new xml2js.Parser();

// sample request:
//
// http://webservices.amazon.com/onca/xml?
// Service=AWSECommerceService&
// Operation=ItemSearch&
// AWSAccessKeyId=[Access Key ID]&
// AssociateTag=[ID]&
// SearchIndex=Apparel&
// Keywords=Shirt
// &Timestamp=[YYYY-MM-DDThh:mm:ssZ]
// &Signature=[Request Signature]

function ProductAdvertising(options) {
  this.locale   = options.locale || 'US';
  this.protocol = (options.https && 'https') || 'http';
  this.host     = ENDPOINTS[this.locale];
  this.key      = options.key;
  this.tag      = options.tag;

  if (!this.key || !this.tag) {
    throw new Error('you need to an api key and associate tag');
  }

  // default url obj
  this.urlTemplate = {
    protocol: this.protocol,
    host: this.host,
    query: {
      // required
      Service: 'AWSECommerceService',
      AWSAccessKeyId: this.key,
      AssociateTag: this.tag
      // optional
    }
  };
}

ProductAdvertising.prototype = {
  buildRequestUrl: function () {
    return url.format(this.urlTemplate);
  },
  request: function (query, callback) {
  }
};

if (require.main === module) {
  var wsdl = 'http://webservices.amazon.com/AWSECommerceService/AWSECommerceService.wsdl';
  request.get(wsdl, function (err, res, body) {
    var json = parser.parseString(body, function (err, result) {
      // fs.writeFileSync('./wsdl.json', JSON.stringify(result));
    });
  });
}
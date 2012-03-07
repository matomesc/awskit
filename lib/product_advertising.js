/**
 * wrapper for amazon's product advertising api
 *
 * Copyright(c) 2012 Mihai Tomescu <matomesc@gmail.com>
 * MIT Licensed
 */

var url = require('url');
var util = require('util');

var _ = require('underscore');
var colors = require('colors');
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

var SEARCHINDEX = {
   'All': 'All',
   'Apparel': 'Apparel',
   'Automotive': 'Automotive',
   'Baby': 'Baby',
   'Beauty': 'Beauty',
   'Blended': 'Blended',
   'Books': 'Books',
   'Classical': 'Classical',
   'DigitalMusic': 'DigitalMusic',
   'DVD': 'DVD',
   'Electronics': 'Electronics',
   'ForeignBooks': 'ForeignBooks',
   'GourmetFood': 'GourmetFood',
   'Grocery': 'Grocery',
   'HealthPersonalCare': 'HealthPersonalCare',
   'Hobbies': 'Hobbies',
   'HomeGarden': 'HomeGarden',
   'Industrial': 'Industrial',
   'Jewelry': 'Jewelry',
   'KindleStore': 'KindleStore',
   'Kitchen': 'Kitchen',
   'Magazines': 'Magazines',
   'Miscellaneous': 'Miscellaneous',
   'MP3Downloads': 'MP3Downloads',
   'Music': 'Music',
   'MusicalInstruments': 'MusicalInstruments',
   'MusicTracks': 'MusicTracks',
   'OfficeProducts': 'OfficeProducts',
   'OutdoorLiving': 'OutdoorLiving',
   'PCHardware': 'PCHardware',
   'PetSupplies': 'PetSupplies',
   'Photo': 'Photo',
   'Software': 'Software',
   'SoftwareVideoGames': 'SoftwareVideoGames',
   'SportingGoods': 'SportingGoods',
   'Tools': 'Tools',
   'Toys': 'Toys',
   'VHS': 'VHS',
   'Video': 'Video',
   'VideoGames': 'VideoGames',
   'Watches': 'Watches',
   'Wireless': 'Wireless',
   'WirelessAccessories': 'WirelessAccessories'
};

//
// exports
//

module.exports = Client;

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

function Client(options) {
  // needed for endpoint
  this.locale       = options.locale || 'US';
  this.protocol     = (options.https && 'https') || 'http';
  this.host         = ENDPOINTS[this.locale];

  // AWS Access Key ID and Secret Access Key
  // they are required
  this.key          = options.key;
  this.secretKey    = options.secretKey;
  if (!this.key || !this.secretKey) {
    throw new Error('missing AWS Access Key ID or Secret Access Key');
  }

  // optional associates tag
  this.tag = options.tag;

  // default request object.. gets cloned when sending requests
  // and merged with user's query params
  this.defaults = {
    protocol: this.protocol,
    host: this.host,
    query: {
      // required
      Service: 'AWSECommerceService',
      AWSAccessKeyId: this.key
    }
  };

  if (this.tag) {
    this.defaults.query.AssociateTag = this.tag;
  }
}

var opts = {};
// add wrappers for operations
OPERATIONS.forEach(function (operation) {
  opts[operation] = function (query, callback) {
    return this.request(operation, query, callback);
  };
});

_.extend(Client.prototype, opts, {
  request: function (operation, query, callback) {
    // check for valid search index
    if (query.SearchIndex && !SEARCHINDEX[query.SearchIndex]) {
      var msg = util.format('invalid search index %s', query.SearchIndex);
      throw new Error(msg);
    }
    // build request obj
    var reqObj = _.extend({}, this.defaults);
    // add the query params
    reqObj.query = _.extend({}, this.defaults.query, { Operation: operation }, query);
    console.log(reqObj);
    console.log(url.format(reqObj).green);
    return;
    return request(reqObj, function (err, res, body) {
      if (err) { return callback(err); }
      return parseString(body, function (err, result) {
        return callback(err, res, result);
      });
    });
  }
});

function NOOP() {}

if (require.main === module) {
  var priv = require('../private');
  var api = new Client({
    key: priv.key,
    secretKey: priv.secretKey
  });
  var search = { SearchIndex: 'Apparel', Keywords: 'Shirt', AssociateTag: 'sumlet03a-20' };
  api.ItemSearch(search, function (err, res, result) {

  });
  console.log(api);
  console.log(Object.getPrototypeOf(api));
}
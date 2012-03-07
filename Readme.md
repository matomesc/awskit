# awskit

> node.js client for working with various Amazon Web Services

## example

```javascript
var awskit = require('awskit');

// products advertising api
var api = new awskit.Products({ key: 'your_key', tag: 'your_tag', https: true });

// search for an item
api.ItemSearch({ Title: 'node.js', SearchIndex: 'Books' }, function (err, res, body) {
  console.log(body);
});
```

## install

```
$ npm install awskit
```

## usage
'use strict';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://mongodb:27017';

// Database Name
const dbName = 'pantip';
// Create a new MongoClient
const client = new MongoClient(url);

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const col = db.collection('students');

  app.get('/', (req, res) => {
    // Get first two documents that match the query
    col.find({}).limit(1).toArray(function(err, docs) {
      assert.equal(null, err);
      res.send(JSON.stringify(docs));
      // client.close();
    });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

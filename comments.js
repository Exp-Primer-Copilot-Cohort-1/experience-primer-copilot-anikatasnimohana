// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');

// Use body-parser to parse application/json
app.use(bodyParser.json());

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'commentdb';
const client = new MongoClient(url);

// Connect to MongoDB
client.connect(function(err) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  // Create collection
  const collection = db.collection('comments');

  // Insert a document
  app.post('/comments', function(req, res) {
    collection.insertOne(req.body, function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Error inserting comment into database');
      } else {
        res.status(201).send(result.ops[0]);
      }
    });
  });

  // Get all comments
  app.get('/comments', function(req, res) {
    collection.find({}).toArray(function(err, docs) {
      if (err) {
        console.log(err);
        res.status(500).send('Error getting comments from database');
      } else {
        res.status(200).send(docs);
      }
    });
  });

  // Delete a comment
  app.delete('/comments/:id', function(req, res) {
    collection.deleteOne({_id: req.params.id}, function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting comment from database');
      } else {
        res.status(204).send();
      }
    });
  });

  // Update a comment
  app.put('/comments/:id', function(req, res) {
    collection.updateOne({_id: req.params.id}, {$set: req.body}, function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating comment in database');
      } else {
        res.status(204).send();
      }
    });
  });

  // Start web server
  app.listen(port, function() {
    console.log('Web server started on port ' + port);
  });
});
// load express module
const express = require('express');

// Initialisierung des express Moduls in der Variable api
const api = new express();

const PORT = 8080;

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
api.use(express.static('_dist'));

// Database
const db = require('../config/database.js');

const Kino = require('../model/Kino');

// Verbindung zur DB testen mit Hilfe der Methode .authenticate()
db.authenticate().then(function () {
  console.log('connected!');
}).catch(function (error) {
  console.log('connection failed: ' + error);
});

api.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

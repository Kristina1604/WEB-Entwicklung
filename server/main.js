// load express module
const express = require('express');

// erzeugen eines application objects durch den Aufruf der top level function von express
const api = express();

const PORT = 8080;

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
api.use(express.static('_dist'));

// Database
const db = require('../config/database.js');

const Model = require('../model/Model');

// Verbindung zur DB testen mit Hilfe der Methode .authenticate()
db.authenticate().then(function () {
  console.log('connected!');
}).catch(function (error) {
  console.log('connection failed: ' + error);
});

// Kinosaal anlegen
api.post('/addKinosaal', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Kinosaal.create({

    kinoname: req.body.kinoName,
    gesamtsitze: req.body.sitzeKomplett

  });
});

// Vorstellung anlegen
api.post('/addVorstellung', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Vorstellung.create({

    datum: req.body.kalendertag,
    uhrzeit: req.body.zeit,
    kinosaal: req.body.kinoSaal,
    filmname: req.body.filmName

  });
});

// Reservierung anlegen
api.post('/addReservierung', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Reservierung.create({

    vorstellung: req.body.filmtitel,
    tickets: req.body.sitzplätze,
    kundenname: req.body.nameKunde
  });
});

// Berechnung der Seite bei max-height
api.get('/api/:page', function (req, res) {
  const LIMIT = 3;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungs) {
    res.json(vorstellungs);
  }).catch(function (error) {
    console.log(error);
  });
});

// Berechnung der Seite bei min-height: 300px
api.get('/api/medium/:page', function (req, res) {
  const LIMIT = 2;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungs) {
    res.json(vorstellungs);
  }).catch(function (error) {
    console.log(error);
  });
});

// Neuberechnung der Seite bei min-height 100px
api.get('/api/small/:page', function (req, res) {
  const LIMIT = 1;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungs) {
    res.json(vorstellungs);
  }).catch(function (error) {
    console.log(error);
  });
});

// Starten des Servers an Port 8080
api.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

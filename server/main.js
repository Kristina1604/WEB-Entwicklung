// load express module
const express = require('express');

// erzeugen eines application objects durch den Aufruf der top level function von express
const app = express();

const args = process.argv;
const PORT = args[2];

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
app.use(express.static('_dist'));

// Database
const db = require('../config/database.js');

const Model = require('../model/Model');

// Verbindung zur DB testen mit Hilfe der Methode .authenticate()
db.authenticate().then(function () {
  console.log('connected!');
}).catch(function (error) {
  console.log('connection failed: ' + error);
});

//   _______________________________________________________________
//
//                    Formulardaten senden
//   _______________________________________________________________

// Kinosaal anlegen
app.post('/addKinosaal', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Kinosaal.create({

    kinoname: req.body.kinoName,
    sitzreihen: req.body.sitzreihen,
    sitze: req.body.sitzeplätze,
    gesamtsitze: req.body.sitzeKomplett

  });
});

// Vorstellung anlegen
app.post('/addVorstellung', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Vorstellung.create({

    filmname: req.body.filmName,
    kinosaal: req.body.kinoSaal,
    uhrzeit: req.body.zeit,
    datum: req.body.kalendertag

  });
});

// Reservierung anlegen
app.post('/addReservierung', function (req, res) {
  console.log('i got a request!');
  console.log(req.body);

  Model.Reservierung.create({

    vorstellung: req.body.filmtitel,
    tickets: req.body.kinokarten,
    kundenname: req.body.nameKunde
  });
});

//   _______________________________________________________________
//
//                    Paginierung von Vorstellungen
//   _______________________________________________________________

// Berechnung der Seite large
app.get('/api/presentation/large/:page', function (req, res) {
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

// Berechnung der Seite medium
app.get('/api/presentation/medium/:page', function (req, res) {
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

// Berechnung der Seite small
app.get('/api/presentation/small/:page', function (req, res) {
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

//   _______________________________________________________________
//
//                    Paginierung von Kinosälen
//   _______________________________________________________________

// Berechnung der Seite large
app.get('/api/cinemaRoom/large/:page', function (req, res) {
  const LIMIT = 3;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  }).catch(function (error) {
    console.log(error);
  });
});

// Berechnung der Seite medium
app.get('/api/cinemaRoom/medium/:page', function (req, res) {
  const LIMIT = 2;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  }).catch(function (error) {
    console.log(error);
  });
});

// Berechnung der Seite small
app.get('/api/cinemaRoom/small/:page', function (req, res) {
  const LIMIT = 1;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  }).catch(function (error) {
    console.log(error);
  });
});

// Starten des Servers an Port 8080

app.listen(PORT || 3000, function () {
  console.log('Server running on port: ' + this.address().port);
});

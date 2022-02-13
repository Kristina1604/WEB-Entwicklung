
const express = require('express');
const db = require('../config/database.js');
const Model = require('../model/Model');

const app = express();

// Zugriff auf das übergebene Kommandozeilenargument
const args = process.argv;
const PORT = args[2];

// Statische Dateien werden mit Hilfe der Middelwarefunktion express.static an den
// browser ausgeliefert
app.use(express.static('_dist'));

app.use(express.json());

// Verbindung zur DB testen mit der Methode authenticate()
db.authenticate().then(function () {
  console.log('connected!');
}).catch(function (error) {
  console.log('connection failed: ' + error);
});

//   _______________________________________________________________
//
//      Vorstellungen/Kinosäle für die Drop-Down Menüs anfordern
//   _______________________________________________________________

app.get('/api/loadShows', function (req, res) {
  Model.Vorstellung.findAll({
    attributes: ['filmname']
  }).then(function (vorstellungen) {
    res.json(vorstellungen);
  });
});

app.get('/api/loadCinemas', function (req, res) {
  Model.Kinosaal.findAll({
    attributes: ['kinoname']
  }).then(function (kinos) {
    res.json(kinos);
  });
});

//   _______________________________________________________________
//
//                      Alle Kinosäle anfordern
//   _______________________________________________________________

app.get('/api/getCinemas', function (req, res) {
  Model.Kinosaal.findAll().then(function (kinos) {
    res.json(kinos);
  });
});

//   _______________________________________________________________
//
//                      Alle Vorstellungen anfordern
//   _______________________________________________________________

app.get('/api/getShows', function (req, res) {
  Model.Vorstellung.findAll().then(function (vorstellungen) {
    res.json(vorstellungen);
  });
});

//   _______________________________________________________________
//
//                   Restplätze in der DB updaten
//   _______________________________________________________________

app.put('/api/restplaetze/:showId', function (req, res) {
  Model.Vorstellung.update(
    { restplaetze: req.body.restplatz },
    { where: { id: req.params.showId } }
  ).then(function () {
    res.status(204).send('successful request');
  });
});

//   _______________________________________________________________
//
//                    Formulardaten senden
//   _______________________________________________________________

// Kinosaal anlegen
app.post('/addCinemaRoom', function (req, res) {
  Model.Kinosaal.create({

    kinoname: req.body.kinoName,
    sitzreihen: req.body.sitzreihen,
    sitze: req.body.sitzeplätze,
    gesamtsitze: req.body.sitzeKomplett

  }).then(function () {
    res.send('successful');
  });
});

// Vorstellung anlegen
app.post('/addPresentation', function (req, res) {
  Model.Vorstellung.create({

    filmname: req.body.filmName,
    kinosaal: req.body.kinoSaal,
    uhrzeit: req.body.zeit,
    datum: req.body.kalendertag,
    restplaetze: req.body.restplaetze

  }).then(function () {
    res.send('successful');
  });
});

// Reservierung anlegen
app.post('/addReservation', function (req, res) {
  Model.Reservierung.create({

    vorstellung: req.body.filmtitel,
    tickets: req.body.kinokarten,
    kundenname: req.body.nameKunde

  }).then(function () {
    res.send('successful');
  });
});

//   _______________________________________________________________
//
//                    Paginierung von Vorstellungen
//   _______________________________________________________________

// Neuberechnung bei Browsergröße "large"
app.get('/api/presentation/large/:page', function (req, res) {
  const LIMIT = 3;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungen) {
    res.json(vorstellungen);
  });
});

// Neuberechnung bei Browsergröße "medium"
app.get('/api/presentation/medium/:page', function (req, res) {
  const LIMIT = 2;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungen) {
    res.json(vorstellungen);
  });
});

// Neuberechnung bei Browsergröße "small"
app.get('/api/presentation/small/:page', function (req, res) {
  const LIMIT = 1;

  const num = req.params.page;
  Model.Vorstellung.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (vorstellungen) {
    res.json(vorstellungen);
  });
});

//   _______________________________________________________________
//
//                    Paginierung von Kinosälen
//   _______________________________________________________________

// Neuberechnung bei Browsergröße "large"
app.get('/api/cinemaRoom/large/:page', function (req, res) {
  const LIMIT = 3;

  const num = req.params.page;
  Model.Kinosaal.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  });
});

// Neuberechnung bei Browsergröße "medium"
app.get('/api/cinemaRoom/medium/:page', function (req, res) {
  const LIMIT = 2;

  const num = req.params.page;
  Model.Kinosaal.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  });
});

// Neuberechnung bei Browsergröße "small"
app.get('/api/cinemaRoom/small/:page', function (req, res) {
  const LIMIT = 1;

  const num = req.params.page;
  Model.Kinosaal.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  });
});

// Abfangen von fehlerhaften URI's
app.use(function (req, res) {
  res.status(404).send('<h1>Error 404 - Hier gibts nichts zu sehen ;D<h1>');
});

// Starten des Servers an Port 8080
app.listen(PORT, function () {
  console.log('Server is running on port: ' + PORT);
});

// load express module
const express = require('express');

// erzeugen eines application objects durch den Aufruf der top level function von express
const app = express();

const args = process.argv;
const PORT = args[2];

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
app.use(express.static('_dist'));

app.use(express.json());

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
//                    Vorstellungen ins Drop-Down laden
//   _______________________________________________________________

app.get('/api/loadShows', function (req, res) {
  Model.Vorstellung.findAll({
    attributes: ['filmname']
  }).then(function (vorstellungs) {
    res.json(vorstellungs);
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
  Model.Kinosaal.findAll({

  }).then(function (kinos) {
    res.json(kinos);
  }).catch(function (error) {
    console.log(error);
  });
});

//   _______________________________________________________________
//
//                      Alle Vorstellungen anfordern
//   _______________________________________________________________

app.get('/api/getShows', function (req, res) {
  Model.Vorstellung.findAll({

  }).then(function (vorstellungs) {
    res.json(vorstellungs);
  }).catch(function (error) {
    console.log(error);
  });
});

//   _______________________________________________________________
//
//                      Restplätze updaten
//   _______________________________________________________________

app.put('/api/restplaetze/:showId', function (req, res) {
  Model.Vorstellung.update(
    { restplaetze: req.body.restplatz },
    { where: { id: req.params.showId } }
  ).then(function (result) {
    console.log('Success: ' + result);
  }).catch(function (error) {
    console.log(error);
  });
});

//   _______________________________________________________________
//
//                    Formulardaten senden
//   _______________________________________________________________

// Kinosaal anlegen
app.post('/addKinosaal', function (req, res) {
  Model.Kinosaal.create({

    kinoname: req.body.kinoName,
    sitzreihen: req.body.sitzreihen,
    sitze: req.body.sitzeplätze,
    gesamtsitze: req.body.sitzeKomplett

  });
});

// Vorstellung anlegen
app.post('/addVorstellung', function (req, res) {
  Model.Vorstellung.create({

    filmname: req.body.filmName,
    kinosaal: req.body.kinoSaal,
    uhrzeit: req.body.zeit,
    datum: req.body.kalendertag,
    restplaetze: req.body.restplaetze

  });
});

// Reservierung anlegen
app.post('/addReservierung', function (req, res) {
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
  Model.Kinosaal.findAndCountAll({
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
  Model.Kinosaal.findAndCountAll({
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
  Model.Kinosaal.findAndCountAll({
    offset: (num - 1) * LIMIT,
    limit: LIMIT
  }).then(function (kinos) {
    res.json(kinos);
  }).catch(function (error) {
    console.log(error);
  });
});

// Abfangen von falschen URI's
app.use(function (req, res) {
  res.status(404).send('<h1>Error 404 - Hier gibts nichts zu sehen ;)<h1>');
});

// Starten des Servers an Port 8080

app.listen(PORT || 3000, function () {
  console.log('Server running on port: ' + this.address().port);
});

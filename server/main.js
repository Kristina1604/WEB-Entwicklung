// load express module
const express = require('express');

// Initialisierung des express Moduls in der Variable api
const api = new express();

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

// Starten des Servers an Port 8080
api.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

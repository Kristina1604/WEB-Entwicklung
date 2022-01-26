
const Sequelize = require('sequelize');
const db = require('../config/database.js');

// 3 Tabellen in DB anlegen

const Kinosaal = db.define('kino', {
  kinoname: {
    type: Sequelize.STRING
  },
  sitze: {
    type: Sequelize.INTEGER
  },
  sitzreihen: {
    type: Sequelize.INTEGER
  },
  gesamtsitze: {
    type: Sequelize.INTEGER
  }
});

const Vorstellung = db.define('vorstellung', {

  datum: {
    type: Sequelize.DATEONLY
  },
  uhrzeit: {
    type: Sequelize.TIME
  },
  kinosaal: {
    type: Sequelize.STRING
  },
  filmname: {
    type: Sequelize.STRING
  },
  restplaetze: {
    type: Sequelize.INTEGER
  }

});

const Reservierung = db.define('reservierung', {

  vorstellung: {
    type: Sequelize.STRING
  },
  tickets: {
    type: Sequelize.INTEGER
  },
  kundenname: {
    type: Sequelize.STRING
  }
});

// Synchronisation von Tabellen und DB

Kinosaal.sync({
  alter: true
});

Vorstellung.sync({
  alter: true
});

Reservierung.sync({
  alter: true
});

// Exportieren der Tabellen damit in main.js darauf zu gegriffen werden kann

exports.Kinosaal = Kinosaal;
exports.Vorstellung = Vorstellung;
exports.Reservierung = Reservierung;

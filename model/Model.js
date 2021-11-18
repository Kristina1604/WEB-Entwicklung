
const Sequelize = require('sequelize');
const db = require('../config/database.js');

// 3 Tabellen in DB anlegen

const Kinosaal = db.define('kino', {
  kinoname: {
    type: Sequelize.STRING
  },
  sitzreihen: {
    type: Sequelize.INTEGER
  },
  sitze: {
    type: Sequelize.INTEGER
  }
});

const Vorstellung = db.define('vorstellung', {

  datum: {
    type: Sequelize.DATE
  },
  uhrzeit: {
    type: Sequelize.TIME
  },
  kinosaal: {
    type: Sequelize.STRING
  },
  filmname: {
    type: Sequelize.STRING
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

// Exportieren der Tabellen damit sie in main.js eingebunden werden können

module.exports = Kinosaal;
module.exports = Vorstellung;
module.exports = Reservierung;

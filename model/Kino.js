
const Sequelize = require('sequelize');
const db = require('../config/database.js');

// model festlegen

const Blogg = db.define('kino', {
  kinoname: {
    type: Sequelize.STRING
  },
  sitzreihen: {
    type: Sequelize.INTEGER
  },
  sitze: {
    type: Sequelize.INTEGER
  },
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
  },
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

// Synchronisation von model und DB

Blogg.sync({
  alter: true
});

module.exports = Blogg;

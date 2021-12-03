const Sequelize = require('sequelize');

// Verbindung zur Datenbank aufbauen
// Liefert ein Objekt zurück welches die Verbindung zur DB representiert

const db = new Sequelize({

  dialect: 'sqlite',
  storage: './database.sqlite3'
});

module.exports = db;

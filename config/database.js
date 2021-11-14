const Sequelize = require('sequelize');

// Verbindung zur Datenbank aufbauen
// Liefert ein Objekt zurück welches die Verbindung zur DB representiert

const db = new Sequelize('kinoverwaltung', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

module.exports = db;

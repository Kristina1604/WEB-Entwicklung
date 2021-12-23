const express = require('express');

const app = express();

const args = process.argv;
const PORT = args[2];

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
app.use(express.static('_dist'));

// starten des Servers an Port 8080
app.listen(PORT || 3000, function () {
  console.log('Server running on port: ' + this.address().port);
});

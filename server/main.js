const express = require('express');

const api = express();

const PORT = process.argv[2] || 8080;

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
api.use(express.static('_dist'));

api.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

// load express module
const express = require('express');

// Initialisierung des express Moduls in der Variable api
const api = new express();

const PORT = 8080; 

// statische Dateien bereit stellen, mit der Middelwarefunktion express.static
api.use(express.static('_dist'));

api.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
});

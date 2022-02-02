
// Vorstellungen anfordern und Drop-Down Menü füllen
async function loadShows () {
  const response = await window.fetch('/api/loadShows');
  const filme = await response.json();

  const selectBox = document.getElementById('input-1');

  for (let count = 0; count < filme.length; count++) {
    const option = document.createElement('option');
    option.text = filme[count].filmname;
    selectBox.options[count] = option;
  }
}

// Kinosäle anfordern und Drop-Down Menü füllen
async function loadCinemas () {
  const response = await window.fetch('/api/loadCinemas');
  const cinema = await response.json();

  const selectBox = document.getElementById('input-1');

  for (let count = 0; count < cinema.length; count++) {
    const option = document.createElement('option');
    option.text = cinema[count].kinoname;
    selectBox.options[count] = option;
  }
}

exports.loadShows = loadShows;
exports.loadCinemas = loadCinemas;

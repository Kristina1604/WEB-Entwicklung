async function loadCinema () {
  const response = await window.fetch('/api/load/cinemas');
  const cinema = await response.json();

  console.log(cinema);

  const selectBox = document.getElementById('input-1');

  for (let count = 0; count < cinema.length; count++) {
    const option = document.createElement('option');
    option.text = cinema[count].kinoname;
    selectBox.options[count] = option;
  }
}

exports.loadCinema = loadCinema;

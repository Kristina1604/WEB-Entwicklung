
function createVorstellung () {
  const filmName = document.getElementById('input-0').value;
  const kinoSaal = document.getElementById('input-1').value;
  const zeit = document.getElementById('input-2').value;
  const kalendertag = document.getElementById('input-3').value;

  const vorstellung = { filmName, kinoSaal, zeit, kalendertag };
  console.log(vorstellung);

  window.fetch('/addVorstellung', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vorstellung)

  });
}

function createKinosaal () {
  const kinoName = document.getElementById('input-0').value;
  const sitzreihen = document.getElementById('input-1').value;
  const sitzeplätze = document.getElementById('input-2').value;

  const sitzeKomplett = sitzeplätze * sitzreihen;

  const kinosaal = { kinoName, sitzreihen, sitzeplätze, sitzeKomplett };
  console.log(kinosaal);

  window.fetch('/addKinosaal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(kinosaal)

  });
}

async function createReservierung () {
  const nameKunde = document.getElementById('input-0').value;

  const selectBox = document.getElementById('input-1');
  const filmtitel = selectBox.options[selectBox.selectedIndex].text;

  const kinokarten = document.getElementById('input-2').value;

  const reservierung = { filmtitel, kinokarten, nameKunde };
  console.log(reservierung);

  window.fetch('/addReservierung', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservierung)

  });
}

exports.createVorstellung = createVorstellung;
exports.createKinosaal = createKinosaal;
exports.createReservierung = createReservierung;
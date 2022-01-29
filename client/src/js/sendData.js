//   _______________________________________________________________
//
//                      Neue Vorstellung eintragen
//   _______________________________________________________________

async function createVorstellung () {
  // Daten lesen aus Inputfeldern
  const filmName = document.getElementById('input-0').value;
  const kinoSaal = document.getElementById('input-1').value;
  const zeit = document.getElementById('input-2').value;
  const kalendertag = document.getElementById('input-3').value;

  // alle Kinos anfordern
  const response = await window.fetch('/api/getCinemas');
  const gesamtKinos = await response.json();

  // gesamtSitze der gesuchen Vorstellung auslesen
  const gesuchtesKino = gesamtKinos.find(kinoObjekt => kinoObjekt.kinoname === kinoSaal);
  const restplaetze = gesuchtesKino.gesamtsitze;

  // ---Paket packen
  const vorstellung = { filmName, kinoSaal, zeit, kalendertag, restplaetze };
  console.log(vorstellung);

  window.fetch('/addVorstellung', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vorstellung)

  });
}

//   _______________________________________________________________
//
//                      Neuen Kinosaal eintragen
//   _______________________________________________________________

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

//   _______________________________________________________________
//
//                      Neue Reservierung eintragen
//   _______________________________________________________________

async function createReservierung () {
  // Daten lesen aus Inputfeldern
  const nameKunde = document.getElementById('input-0').value;
  const filmtitel = document.getElementById('input-1').value;
  const kinokarten = parseInt(document.getElementById('input-2').value);

  const response = await window.fetch('/api/getShows');
  const gesamtVorstellungen = await response.json();

  // restplätze und id der gesuchten vorstellung auslesen
  const gesuchteVorstellung = gesamtVorstellungen.find(vorstellungObjekt => vorstellungObjekt.filmname === filmtitel);
  const restplatz = gesuchteVorstellung.restplaetze - kinokarten;
  const id = gesuchteVorstellung.id;

  // prüfen ob die Restplätze für die gebuchten tickets ausreichen

  // ---Paket packen
  const reservierung = { filmtitel, kinokarten, nameKunde };
  console.log(reservierung);

  window.fetch('/addReservierung', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservierung)

  });

  // To-Do
  // ticketsabziehen(kinokarten)

  const restplaetze = { restplatz };
  console.log('Objekt: ', restplaetze);

  window.fetch('/api/restplaetze/' + `${id}`, {

    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(restplaetze)
  });
}

exports.createVorstellung = createVorstellung;
exports.createKinosaal = createKinosaal;
exports.createReservierung = createReservierung;

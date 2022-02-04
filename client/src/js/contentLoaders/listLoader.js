const {
  SITE
} = require('../templates.js');
const { getCurrentSite } = require('../router.js');

// Alle Breakpoints in Pixeln (kann beliebig erweitert/geändert werden)
const LISTHEIGHT_BREAKPOINTS = [500, 600];
// Aktuell vorliegender 'Fall' als Zahl
// 0 für '<500px'
// 1 für '500-599px'
// 2 für '>=600px'
let CURRENT_LISTHEIGHT_STATE;
/**
 * Passt CURRENT_LISTHEIGHT_STATE an.
 * 0, wenn Fenster kleiner LISTHEIGHT_BREAKPOINTS[0]
 * 1, wenn zwischen LISTHEIGHT_BREAKPOINTS[0] und [1]
 * 2, wenn zwischen [1] und [2] etc...
 * Ausserdem wird bei einer Änderung das ListLayout aktualisiert
 * Wird bei Fenstergrößenänderung aufgerufen
 */

// Liste responsive machen:
const initListLoader = function () {
  // Listener, der jedes Mal, wenn die Fenstergröße sich ändert, feuert
  window.addEventListener('resize', checkCurrentListHeightState);
  checkCurrentListHeightState(); // Initialisieren
};

// ********************
// ListenResponsiveness
// ********************
function checkCurrentListHeightState () {
  // Aktuelle Fensterhöhe abfragen
  const currentHeight = window.innerHeight;

  // Neuen State herausfinden
  let newIndex = LISTHEIGHT_BREAKPOINTS.findIndex(breakpoint => currentHeight < breakpoint);
  if (newIndex === -1) {
    // FensterHeight größer als letzter Breakpoint
    newIndex = LISTHEIGHT_BREAKPOINTS.length;
  }

  // Nur weitermachen, wenn sich der State geändert hat
  if (newIndex !== CURRENT_LISTHEIGHT_STATE) {
    // Neuen State global abspeichern
    CURRENT_LISTHEIGHT_STATE = newIndex;
    const currentSite = getCurrentSite();
    // Wenn wir uns gerade auf der Liste befinden, muss diese neu geladen werden
    if (currentSite === SITE.VORSTELLUNGEN_ANZEIGEN) {
      loadPresentationList();
    } else if (currentSite === SITE.KINOSÄLE_ANZEIGEN) {
      loadRoomList();
    }
  }
}

/**
 * Läd und aktualisiert Liste und Listenlayout für Vorstellungen (Einträge pro Seite, Anzahl Seitenbuttons)
 */
async function loadPresentationList () {
  // Die Funktionen für die verschiedenen Layouts unterscheiden sich nur in wenigen Punkten
  // Die Variablen dafür werden in den folgenden Zeilen definiert
  let entriesPerSite;
  let fetchPath;
  let buttonContainerId;
  let additionalButtonClasses;

  switch (CURRENT_LISTHEIGHT_STATE) {
    case 0:
      // Small
      entriesPerSite = 1;
      fetchPath = '/api/presentation/small/';
      buttonContainerId = 'divButtonsSmall';
      additionalButtonClasses = 'btn-sm';
      break;
    case 1:
      // Medium
      entriesPerSite = 2;
      fetchPath = '/api/presentation/medium/';
      buttonContainerId = 'divButtonsMedium';
      additionalButtonClasses = '';
      break;
    case 2:
      // Large
      entriesPerSite = 3;
      fetchPath = '/api/presentation/large/';
      buttonContainerId = 'divButtonsLarge';
      additionalButtonClasses = '';
      break;
  }

  // Ab hier müsste dir alles bekannt vorkommen
  // Die einzigen Unterschiede ab jetzt sind
  // 1. Die Verwendung der oben definierten Variablen (entriesPerSite,fetchPath,...),
  // um die 3 Fälle (small, medium, large) unterscheiden zu können
  // 2. Die removeListpageButtons-Funktion, die aber das selbe macht wie dein Code davor.
  // Ich musste sie nur auslagern, um die Buttons auch beim Wechsel auf eine Formularseite entfernen zu können

  async function getData () {
    const page = 1;
    const response = await window.fetch(fetchPath + `${page}`);
    const data = await response.json();

    console.log(data);

    function listItemTemplate (vorstellung) {
      return `
              <div class= "border border-info rounded flex-items-container">
                  <div class= "container-name"> ${vorstellung.filmname} </div>
                  <div class="container-datum"> ${vorstellung.datum} </div> </br>
                  <div class="container-info"> 
                    ${vorstellung.kinosaal} 
                    </br>
                    ${vorstellung.uhrzeit} Uhr 
                  </div>

              </div>
              `;
    }
    document.getElementById('formular').innerHTML = `

          <p class="font-weight-bold">${data.count} Einträge - Seite 1 von ${Math.ceil(data.count / entriesPerSite)}</p>
          ${data.rows.map(listItemTemplate).join('')}

          `;

    // prüfen ob ein Button Container existiert, wenn ja dann lösche ihn...
    removeListpageButtons();

    // ...und erstelle einen neuen
    const containerButtons = document.createElement('div');
    containerButtons.setAttribute('id', buttonContainerId);
    containerButtons.className = 'buttonContainer';

    for (let page = 1; page <= `${Math.ceil(data.count / entriesPerSite)}`; page++) {
      const button = document.createElement('button');
      button.innerHTML = page;
      button.className = 'btn btn-outline-light ' + additionalButtonClasses;
      button.value = page;
      button.addEventListener('click', buttonFunction);

      containerButtons.appendChild(button);
    }

    document.body.appendChild(containerButtons);

    function buttonFunction () {
      const page = this.value;

      getData();
      async function getData () {
        const response = await window.fetch(fetchPath + `${page}`);
        const data = await response.json();

        function listItemTemplate (vorstellung) {
          return `

                    <div class= "border border-info rounded flex-items-container">

                        <div class= "container-name"> ${vorstellung.filmname} </div>

                        <div class="container-datum"> ${vorstellung.datum} </div> </br>
                        <div class="container-info"> 
                        ${vorstellung.kinosaal} 
                        </br>
                        ${vorstellung.uhrzeit} Uhr 
                        </div>

                    </div>`;
        }
        document.getElementById('formular').innerHTML = `

                    <p class="font-weight-bold">${data.count} Einträge - Seite ${page} von ${Math.ceil(data.count / entriesPerSite)}</p>
                    ${data.rows.map(listItemTemplate).join('')}`;
      }
    }
  }
  getData();
}

/**
 * Läd und aktualisiert Liste und Listenlayout für Kinosääle (Einträge pro Seite, Anzahl Seitenbuttons)
 */
async function loadRoomList () {
  console.log('loadRoomList');
  // Die Funktionen für die verschiedenen Layouts unterscheiden sich nur in wenigen Punkten
  // Die Variablen dafür werden in den folgenden Zeilen definiert
  let entriesPerSite;
  let fetchPath;
  let buttonContainerId;
  let additionalButtonClasses;

  switch (CURRENT_LISTHEIGHT_STATE) {
    case 0:
      // Small
      entriesPerSite = 1;
      fetchPath = '/api/cinemaRoom/small/';
      buttonContainerId = 'divButtonsSmall';
      additionalButtonClasses = 'btn-sm';
      break;
    case 1:
      // Medium
      entriesPerSite = 2;
      fetchPath = '/api/cinemaRoom/medium/';
      buttonContainerId = 'divButtonsMedium';
      additionalButtonClasses = '';
      break;
    case 2:
      // Large
      entriesPerSite = 3;
      fetchPath = '/api/cinemaRoom/large/';
      buttonContainerId = 'divButtonsLarge';
      additionalButtonClasses = '';
      break;
  }

  // Ab hier müsste dir alles bekannt vorkommen
  // Die einzigen Unterschiede ab jetzt sind
  // 1. Die Verwendung der oben definierten Variablen (entriesPerSite,fetchPath,...),
  // um die 3 Fälle (small, medium, large) unterscheiden zu können
  // 2. Die removeListpageButtons-Funktion, die aber das selbe macht wie dein Code davor.
  // Ich musste sie nur auslagern, um die Buttons auch beim Wechsel auf eine Formularseite entfernen zu können

  async function getData () {
    const page = 1;
    const response = await window.fetch(fetchPath + `${page}`);
    const data = await response.json();

    function listItemTemplate (kino) {
      return `
              <div class= "border border-info rounded flex-items-container">
                  <div class= "container-name"> ${kino.kinoname} </div>
                  <div class="container-info">
                    Sitzreihen: ${kino.sitzreihen}
                    </br>
                    Sitze pro Sitzreihe: ${kino.sitze}
                  </div>

              </div>
              `;
    }
    document.getElementById('formular').innerHTML = `

          <p class="font-weight-bold">${data.count} Einträge - Seite 1 von ${Math.ceil(data.count / entriesPerSite)}</p>
          ${data.rows.map(listItemTemplate).join('')}

          `;

    // prüfen ob ein Button Container existiert, wenn ja dann lösche ihn...
    removeListpageButtons();

    // ...und erstelle einen neuen
    const containerButtons = document.createElement('div');
    containerButtons.setAttribute('id', buttonContainerId);
    containerButtons.className = 'buttonContainer';

    for (let page = 1; page <= `${Math.ceil(data.count / entriesPerSite)}`; page++) {
      const button = document.createElement('button');
      button.innerHTML = page;
      button.className = 'btn btn-outline-light ' + additionalButtonClasses;
      button.value = page;
      button.addEventListener('click', buttonFunction);

      containerButtons.appendChild(button);
    }

    document.body.appendChild(containerButtons);

    function buttonFunction () {
      const page = this.value;

      getData();
      async function getData () {
        const response = await window.fetch(fetchPath + `${page}`);
        const data = await response.json();

        function listItemTemplate (kino) {
          return `
                  <div class= "border border-info rounded flex-items-container">
                      <div class= "container-name"> ${kino.kinoname} </div>
                      <div class="container-info">
                        Sitzreihen: ${kino.sitzreihen}
                        </br>
                        Sitze pro Sitzreihe: ${kino.sitze}
                      </div>
    
                  </div>
                  `;
        }
        document.getElementById('formular').innerHTML = `

                    <p class="font-weight-bold">${data.count} Einträge - Seite ${page} von ${Math.ceil(data.count / entriesPerSite)}</p>
                    ${data.rows.map(listItemTemplate).join('')}`;
      }
    }
  }
  getData();
}

/**
 * Entfernt Buttons für den Seitenwechsel der Liste (wenn vorhanden)
 */
function removeListpageButtons () {
  if (document.getElementById('divButtonsMedium') !== null) {
    const buttonContainerMedium = document.getElementById('divButtonsMedium');
    document.body.removeChild(buttonContainerMedium);
  } else if (document.getElementById('divButtonsLarge') !== null) {
    const buttonContainer = document.getElementById('divButtonsLarge');
    document.body.removeChild(buttonContainer);
  } else if (document.getElementById('divButtonsSmall') !== null) {
    const buttonContainerSmall = document.getElementById('divButtonsSmall');
    document.body.removeChild(buttonContainerSmall);
  }
}

module.exports = {
  initListLoader: initListLoader,
  loadPresentationList: loadPresentationList,
  loadRoomList: loadRoomList,
  removeListpageButtons: removeListpageButtons
};

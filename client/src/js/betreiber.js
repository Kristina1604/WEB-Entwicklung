/*
 * ---------------------------------------------------------------
 * ----------------------------Imports----------------------------
 * ---------------------------------------------------------------
 */
const {
  createVorstellung, createKinosaal, createReservierung
} = require('./sendData.js');
const {
  createElement,
  addClass,
  removeClass,
  setText,
  addElement,
  addElements
} = require('./domHelper.js');
const {
  SITE,
  FORMULAR_TEMPLATES
} = require('./templates.js');
const togglePopup = require('./popup.js');
const { loadShow } = require('./loadShows.js');
/*
 * ---------------------------------------------------------------
 * -------------------------Event-Listener------------------------
 * ---------------------------------------------------------------
 */

// Eventlistener für die Hauptbuttons in der Navbar
const primaryButtons = document.getElementsByClassName('primaryButton');
for (let i = 0; i < primaryButtons.length; i++) {
  primaryButtons.item(i).addEventListener('click', handlePrimaryButtonClick);
}

// Eventlistener für Unterbuttons in der Navbar
const subButtons = document.getElementsByClassName('subButton');
for (let i = 0; i < subButtons.length; i++) {
  subButtons.item(i).addEventListener('click', handleNavButtonClick);
}

// Listener, der jedes Mal, wenn die Fenstergröße sich ändert, feuert
window.addEventListener('resize', checkCurrentListHeightState);

/*
 * ---------------------------------------------------------------
 * -----------------------Globale Variablen-----------------------
 * ---------------------------------------------------------------
 */

// ********************
// ******Nav-Menü******
// ********************

// Variable für aktuell geöffnete Seite
let CURRENTSIDE = SITE.VORSTELLUNGEN_ANZEIGEN;

// ********************
// ListenResponsiveness
// ********************
// Alle Breakpoints in Pixeln (kann beliebig erweitert/geändert werden)
const LISTHEIGHT_BREAKPOINTS = [500, 600];
// Aktuell vorliegender 'Fall' als Zahl
// 0 für '<500px'
// 1 für '500-599px'
// 2 für '>=600px'
let CURRENT_LISTHEIGHT_STATE;
checkCurrentListHeightState(); // Initialisieren

/*
 * ---------------------------------------------------------------
 * -------------------------Seiten-Events-------------------------
 * ---------------------------------------------------------------
 */

/**
 * Event, bei Klick auf Hauptbutton
 * @param {event} event
 */
function handlePrimaryButtonClick (event) {
  const primaryButtonId = event.target.id; // => homeButton, operatorButton oder customerButton

  // Alle Menüs schließen
  closeMenu('homeButton');
  closeMenu('operatorButton');
  closeMenu('customerButton');

  // Richtiges Menü öffnen
  openMenu(primaryButtonId);

  // Ein Klick auf Home führt auch zu einem Seitenwechsel
  if (primaryButtonId === 'homeButton') {
    handleNavButtonClick(event);
  }
}

/**
 * Öffnet Menü und passt ButtonStyle an
 * @param {id} id Id des Hauptbuttons, deren Menü geöffnet werden soll
 */
function openMenu (id) {
  // Buttondesign ändern
  addClass(document.getElementById(id), 'openPrimaryButton');

  if (id === 'homeButton') {
    return;
  }

  // Alle SubButtons auf active schalten
  const subButtonsClass = id === 'operatorButton' ? 'oSubButton' : 'cSubButton';
  const subButtons = document.getElementsByClassName(subButtonsClass); // HTMLCollection aller Dropdownitems des entsprechenden Dropdownmenüs
  // HTMLCollection erlaubt kein forEach(), deshalb wandle ich es in ein normales Array um
  const subButtonsArray = [];
  for (let i = 0; i < subButtons.length; i++) {
    subButtonsArray.push(subButtons.item(i));
  }
  subButtonsArray.forEach(i => {
    removeClass(i, 'inactive');
    addClass(i, 'active');
  });
}

/**
 * Schließt Menü und passt ButtonStyle an
 * @param {id} id Id des Hauptbuttons, deren Menü geschlossen werden soll
 */
function closeMenu (id) {
  // Buttondesign ändern
  removeClass(document.getElementById(id), 'openPrimaryButton');

  if (id === 'homeButton') {
    return;
  }

  // Alle SubButtons auf inactive schalten
  const subButtonsClass = id === 'operatorButton' ? 'oSubButton' : 'cSubButton';
  const subButtons = document.getElementsByClassName(subButtonsClass); // HTMLCollection aller Dropdownitems des entsprechenden Dropdownmenüs
  // HTMLCollection erlaubt kein forEach(), deshalb wandle ich es in ein normales Array um
  const subButtonsArray = [];
  for (let i = 0; i < subButtons.length; i++) {
    subButtonsArray.push(subButtons.item(i));
  }
  subButtonsArray.forEach(i => {
    removeClass(i, 'active');
    addClass(i, 'inactive');
  });
}

/**
 * Koordiniert Klick auf Button für "Seitenwechsel"
 * @param {Event} event  Event beim Klick auf Unterbutton in der Navbar
 */
function handleNavButtonClick (event) {
  // Seite, die angeklickt wurde
  const newSite = event.target.id;
  switchSite(newSite);
}

/**
 * Koordiniert "Seitenwechsel" (Richtiges Formular laden)
 * @param {String} newSite Name der neuen Seite
 */
function switchSite (newSite) {
  // Klick auf Seite, die bereits offen ist, hat keine Wirkung
  if (newSite === CURRENTSIDE) {
    return;
  }

  const formularWrapper = document.getElementById('formular');
  // Alten Inhalt entfernen
  clearCurrentSite();
  // Neuer Seitenwert in globalen Variablen hinterlegen
  CURRENTSIDE = newSite;

  // Passendes Formular laden
  if (newSite === SITE.VORSTELLUNGEN_ANZEIGEN) {
    loadPresentationList();
  } else if (newSite === SITE.KINOSÄLE_ANZEIGEN) {
    loadRoomList();
  } else {
    addElement(formularWrapper, createFormFromJSON(FORMULAR_TEMPLATES[newSite]));
  }
}

function createQrCodeSite () {
  const wrapper = createElement('div');
  const text = createElement('div');
  setText(text, 'Vielen Dank');
  const qrCode = getQrCodeCode();
  addElements(wrapper, [text, qrCode]);
  return wrapper;
}

function getQrCodeCode () {
  const QRCode = require('qrcode');
  const serverResponse = { name: 'Max Mustermann', anzahl: 1, Vorstellung: 'MusterVorstlelung' };
  const canvas = createElement('canvas', { width: '300px', height: '300px' });
  const container = createElement('div');
  addElement(container, canvas);
  const errorFn = function (error) {
    if (error) {
      console.log(error);
    }
  };
  QRCode.toCanvas(canvas, JSON.stringify(serverResponse), errorFn);
  return container;
}

function clearCurrentSite () {
  const formularWrapper = document.getElementById('formular');
  formularWrapper.innerHTML = '';
  removeListpageButtons();
  CURRENTSIDE = SITE.EMPTY;
}

/**
 * Erstellt <form>-Element aus Datenobjekt
 * @param {Object} json Object mit allen Informationen, um daraus eine <form> zu generieren
 * @returns {HTMLElement}
 */
function createFormFromJSON (json) {
  let idCounter = 0; // Zählvariable, um eindeutige IDs generieren zu können
  // Erstellt einzelnen Inputabschnitt (Beschreibung des Inputs und Input selbst)
  const createFormElement = function (inputJSON) {
    const inputID = `input-${idCounter}`;

    const wrapper = createElement('div', { class: 'form-group' });
    const label = createElement('label', { for: inputID, text: inputJSON.description });
    let input;
    switch (inputJSON.type) {
      case 'text':
        input = createElement('input', { class: 'form-control inputField', type: 'text', id: inputID, placeholder: inputJSON.placeholder });
        break;
      case 'select':
        input = createElement('select', { class: 'form-control inputField', id: inputID });
        loadShow();
        break;
      case 'number':
        input = createElement('input', { class: 'form-control inputField', type: 'number', id: inputID, placeholder: inputJSON.placeholder });
        break;
      case 'date':
        input = createElement('input', { class: 'form-control inputField', type: 'date', id: inputID });
        break;
      case 'time':
        input = createElement('input', { class: 'form-control inputField', type: 'time', id: inputID });
        break;
    }
    idCounter++;
    addElements(wrapper, [label, input]);
    return wrapper;
  };
  // <form>-Element erstellen und füllen
  const form = createElement('form', { class: 'p-4', id: 'form' });
  for (const inputJSON of json.inputs) {
    addElement(form, createFormElement(inputJSON));
  }
  const submitButton = createElement('button', { text: 'Absenden', type: 'button', id: `submitButton-${json.buttonId}`, class: 'btn btn-outline-light' });
  submitButton.addEventListener('click', startSubmit);
  addElement(form, submitButton);
  return form;
}

/**
 * Event, wenn auf den Absendbutton eines Formulars geklickt wurde
 */
function startSubmit () {
  switch (CURRENTSIDE) {
    case SITE.VORSTELLUNG_ANLEGEN:
      togglePopup();
      createVorstellung();
      break;
    case SITE.KINOSAAL_ANLEGEN:
      togglePopup();
      createKinosaal();
      break;
    case SITE.TICKETS_RESERVIEREN:
      createReservierung();
      break;
    default:
      console.log('Error');
  }
}

// Liste responsive machen:

/**
 * Passt CURRENT_LISTHEIGHT_STATE an.
 * 0, wenn Fenster kleiner LISTHEIGHT_BREAKPOINTS[0]
 * 1, wenn zwischen LISTHEIGHT_BREAKPOINTS[0] und [1]
 * 2, wenn zwischen [1] und [2] etc...
 * Ausserdem wird bei einer Änderung das ListLayout aktualisiert
 * Wird bei Fenstergrößenänderung aufgerufen
 */
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
    // Wenn wir uns gerade auf der Liste befinden, muss diese neu geladen werden
    if (CURRENTSIDE === SITE.VORSTELLUNGEN_ANZEIGEN) {
      loadPresentationList();
    } else if (CURRENTSIDE === SITE.KINOSÄLE_ANZEIGEN) {
      loadRoomList();
    }
  }
}

/**
 * Läd und aktualisiert Liste und Listenlayout für Vorstellungen (Einträge pro Seite, Anzahl Seitenbuttons)
 */
function loadPresentationList () {
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
function loadRoomList () {
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

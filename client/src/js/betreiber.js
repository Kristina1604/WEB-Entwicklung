const createMessage = require('./sendData.js');

/*
 * ---------------------------------------------------------------
 * -------------------------Event-Listener------------------------
 * ---------------------------------------------------------------
 */

// Eventlistener für die Hauptbuttons in der Navbar
const primaryButtons = document.getElementsByClassName('primaryButton');
for (let i = 0; i < primaryButtons.length; i++) {
  primaryButtons.item(i).addEventListener('click', toggleMenu);
}

// Eventlistener für Unterbuttons in der Navbar
const subButtons = document.getElementsByClassName('subButton');
for (let i = 0; i < subButtons.length; i++) {
  subButtons.item(i).addEventListener('click', switchSide);
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
// Variablen, die den aktuellen Zustand der beiden 'Dropdowns' erfassen
// c = customer
// o = operator
let O_OPEN = false;
let C_OPEN = false;

// ********************
// **Seitennavigation**
// ********************
// Objekt um Enumwerte für currentSide zu imitieren
// Werte müssen den zugehörigen IDs der Buttons in der NavBar entsprechen
const SITE = {
  EMPTY: 'leer',
  VORSTELLUNG_ANLEGEN: 'vorstellungAnlegen',
  KINOSAAL_ANLEGEN: 'kinosaalAnlegen',
  TICKETS_RESERVIEREN: 'ticketsReservieren',
  VORSTELLUNGEN_ANZEIGEN: 'vorstellungenAnzeigen'
};
Object.freeze(SITE);
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

// ********************
// ***Formular-Daten***
// ********************
// Daten zum Laden eines Formulars. Property-Keys müssen IDs der zugehörgen Buttons / Enumvariable SITE entsprechen
const FORMULAR_TEMPLATES = {
  ticketsReservieren: {
    buttonId: 'ticketsReservieren',
    inputs: [
      {
        description: 'Name',
        placeholder: 'Geben Sie ihren vollen Namen ein',
        type: 'text'
      },
      {
        description: 'Vorstellung',
        placeholder: 'Wählen Sie eine Vorstellung',
        type: 'select',
        options: ['Alladin 5', 'Batman vs KingKong ']
      },
      {
        description: 'Anzahl Tickets',
        placeholder: 'Wie viele Tickets wollen Sie bestellen?',
        type: 'number'
      }

    ]
  },
  kinosaalAnlegen: {
    buttonId: 'kinosaalAnlegen',
    inputs: [
      {
        description: 'Name',
        placeholder: 'Geben Sie den Namen des Kinosaals ein',
        type: 'text'
      },
      {
        description: 'Anzahl Reihen',
        placeholder: 'Wählen Sie die Anzahl der Reihen',
        type: 'number'
      },
      {
        description: 'Anzahl Sitze pro Reihe',
        placeholder: 'Wählen Sie die Anzahl der Sitze pro Reihe',
        type: 'number'
      }

    ]
  },
  vorstellungAnlegen: {
    buttonId: 'vorstellungAnlegen',
    inputs: [
      {
        description: 'Name',
        placeholder: 'Geben Sie den Namen der Vorstellung ein',
        type: 'text'
      },
      {
        description: 'Kinosaal',
        placeholder: 'Geben Sie den Kinosaal ein',
        type: 'text'
      },
      {
        description: 'Uhrzeit',
        type: 'time'
      },
      {
        description: 'Datum',
        type: 'date'
      }

    ]
  }
};

/*
 * ---------------------------------------------------------------
 * -------------------------Seiten-Events-------------------------
 * ---------------------------------------------------------------
 */

/**
 * Öffnet und schließt die beiden Dropdowns in der Navleiste
 * @param {Event} event Event welches Informationen über den 'Klick' des Benutzers enthält
 */
function toggleMenu (event) {
  const currentToggle = event.target.id.charAt(0); // Evaluiert zu 'c' bei Klick auf Kunde, und zu 'o' bei Klick auf Betreiber
  const open = currentToggle === 'c' ? C_OPEN : O_OPEN; // Übernimmt Booleanwert (auf=true,zu=false) des entsprechenden Dropdowns
  const subButtons = document.getElementsByClassName(`${currentToggle}SubButton`); // HTMLCollection aller Dropdownitems des entsprechenden Dropdownmenüs

  // HTMLCollection erlaubt kein forEach(), deshalb wandle ich es in ein normales Array um
  const subButtonsArray = [];
  for (let i = 0; i < subButtons.length; i++) {
    subButtonsArray.push(subButtons.item(i));
  }

  if (open) {
    // Das angeklickte Menü ist offen => Menü schließen
    subButtonsArray.forEach(i => {
      removeClass(i, 'active');
      addClass(i, 'inactive');
    });
  } else {
    // Das angeklickte Menü ist geschlossen => Menü öffnen
    subButtonsArray.forEach(i => {
      removeClass(i, 'inactive');
      addClass(i, 'active');
    });
  }

  // Die richtige Booleanvariable muss noch geflipt werden
  currentToggle === 'c' ? C_OPEN = !C_OPEN : O_OPEN = !O_OPEN;

  // Ein geöffneter Hauptbutton soll etwas heller als ein geschlossener sein
  const primaryButton = document.getElementById(currentToggle === 'c' ? 'customerButton' : 'operatorButton');
  open ? removeClass(primaryButton, 'openPrimaryButton') : addClass(primaryButton, 'openPrimaryButton');
}

/**
 * Koordiniert "Seitenwechsel" (Richtiges Formular laden)
 * @param {Event} event  Event beim Klick auf Unterbutton in der Navbar
 * @returns
 */
function switchSide (event) {
  // Seite, die angeklickt wurde
  const newSite = event.target.id;

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
  } else {
    addElement(formularWrapper, createFormFromJSON(FORMULAR_TEMPLATES[newSite]));
  }
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
        inputJSON.options.forEach(option => addElement(input, createElement('option', { text: option })));
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
  const submitButton = createElement('button', { text: 'Absenden', type:'button', id: `submitButton-${json.buttonId}`, class: 'btn btn-outline-light' });
  submitButton.addEventListener('click', togglePopup);
  addElement(form, submitButton);
  return form;
}
console.log('Test: ', createMessage.createVorstellung);
/**
 * Öffnet die Popupansicht (also ausgegrauter Hintergrund und Popup)
 */
function togglePopup () {
  // Hintergrund ausgrauen, indem ein schwarzes Div über die komplette Seite gelegt wird, welches ein bisschen durchsichtig ist
  const body = document.getElementById('body');
  const blurPage = createElement('div', { class: 'blurPage justify-content-center mx-auto', id: 'blurPage' });
  // Ein klick auf den ausgegrauten Bereich schließt das Popup wieder
  blurPage.addEventListener('click', closePopup);

  // Popupdiv
  const popupWrapper = createElement('div', {
    class: 'popupWrapper',
    id: 'popupWrapper'
  });

  // Problem: Klick auf Popup löst Clickevent der blurPage (siehe Zeile 226) aus
  // Grund: Klickevents werden standardmäßig an 'unterdrunterliegende' Elemente weitergereicht
  // Lösung: event.stopPropagation() beendet das 'weiter reichen'
  popupWrapper.addEventListener('click', e => e.stopPropagation());

  // Unterelemente fürs Popup erstellen
  const popupHeader = createElement('div', { class: 'popupHeader', id: 'popupHeader' });
  const popupText = createElement('div', { class: 'popupText', id: 'popupText', text: 'Vielen Dank' });
  const popupFooter = createElement('div', { class: 'popupFooter', id: 'popupFooter' });
  const acceptButton = createElement('button', { text: 'Alles klar', class: 'acceptButton btn btn-primary' });

  // Buttonclick soll das Popup schließen
  acceptButton.addEventListener('click', closePopup);

  // Alles zusammenstecken
  addElement(popupFooter, acceptButton);
  addElements(popupWrapper, [popupHeader, popupText, popupFooter]);
  addElement(blurPage, popupWrapper);
  addElement(body, blurPage);

  // Die Position des Popups ist allerdings noch nirgendwo definiert.
  // Die Logik dafür habe ich in eine eigene Funktion verlegt
  adjustPopupPosition();

  // Probem: Das Groß- und Kleinziehen des Browserfensters bei offenem Popup verschiebt unser Menu, die Popupposition bleibt allerdings gleich
  // Grund: Bei Öffnen des Popups wird die Position 1x fest geladen, und bleibt dann immer gleich
  // Lösung: Position neu berechnen, jedes mal wenn sich das Browserfenster verändert
  window.addEventListener('resize', adjustPopupPosition);
}

/**
 * Platziert das Popup horizontal zentriert, oben anliegend, im Formularteil des Menüs
 * Es wird dann noch um einen festen Wert (marginTop) nach unten geschoben
 */
function adjustPopupPosition () {
  // X- bzw Y-Wert der view Ränder des Formularelements
  const formularEdges = document.getElementById('formular').getBoundingClientRect();

  // Genauer Mittelpunkt des Elements
  const midPoint = { left: Math.round((formularEdges.right + formularEdges.left) / 2)/*, top: Math.round((formularEdges.bottom + formularEdges.top)/2) */ };

  const popupWrapper = document.getElementById('popupWrapper');
  const popupWidth = popupWrapper.offsetWidth;
  const marginTop = 10;

  // Positioniert Popup neu
  popupWrapper.style.left = Math.round(midPoint.left - popupWidth / 2) + 'px';
  popupWrapper.style.top = Math.round(formularEdges.top + marginTop) + 'px';
}

/**
 * Schließt Poopupansicht wieder
 */
function closePopup (_event) {
  removeElement(document.getElementById('blurPage'));
  // Eventlistener ist nicht mehr nötig
  window.removeEventListener('resize', adjustPopupPosition);
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
    }
  }
}

/**
 * Läd und aktualisiert Liste und Listenlayout (Einträge pro Seite, Anzahl Seitenbuttons)
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
 * TODO:
 * loadRoomList()
 *
 *    function listItemTemplate (kino) {
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
 */

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

/*
 * ---------------------------------------------------------------
 * -------------------------Hilfsmethoden-------------------------
 * ---------------------------------------------------------------
 */

/**
 * Erzeugt neues Element, optional direkt mit Klassen, Styles oder sonstigen Attributen
 * @param {String} tagName Name des Element-Tags
 * @param {Object} attributes OPTIONAL z.B {class:"d-flex row",style:"backgroundColor:red;"}
 * @returns {Element} newElement Das neue Element
 */
function createElement (tagName, attributes) {
  const newElement = document.createElement(tagName);
  for (const prop in attributes) {
    switch (prop) {
      case 'class':
        for (const singleClass of attributes[prop].split(' ')) {
          addClass(newElement, singleClass);
        }
        break;
      case 'style':
        setStyle(newElement, attributes[prop]);
        break;
      case 'text':
        setText(newElement, attributes[prop]);
        break;
      default:
        setAttribute(newElement, prop, attributes[prop]);
    }
  }
  return newElement;
}

/**
 * Entfernt ein Element aus dem DOM-Baum
 * @param {Element} element Das zu löschende Element
 */
function removeElement (element) {
  element.parentElement.removeChild(element);
}

/**
 * Definiert Text innerhalb eines Elements
 * ACHTUNG:Nur für Elemente ohne Kinder verwenden
 * @param {Element} element Element in welches ein Text eingefügt wird
 * @param {String} text Text, welcher eingefügt wird
 */
function setText (element, text) {
  element.innerHTML = text;
}

/**
 * Definiert Style-Property für ein Element
 * @param {Element} element Element, für welches das Attribut "Style" definiert wird
 * @param {String} styleString String der Form "cssAttribute:Vvlue;cssAttribute:value;..."
 */
function setStyle (element, styleString) {
  element.style.cssText = styleString;
}

/**
 * Definiert beliebiges Attribut für ein Element.
 * Bereits bestehende Elemente werden überschrieben.
 * @param {Element} element Element, für welches das Attribut definiert wird
 * @param {String} key Attributname
 * @param {String} value Wert des Attributs
 */
function setAttribute (element, key, value = key) {
  element.setAttribute(key, value);
}

/**
 * Weißt einem Element eine Klasse zu
 * @param {Element} element Element, welchem die Klasse zugewiesen wird
 * @param {String} classString Klasse als String, welche hinzugefügt wird
 */
function addClass (element, classString) {
  element.classList.add(classString);
}

/**
 * Entfernt Klasse vom Element
 * @param {Element} element Element, von welchem die Klasse entfernt wird
 * @param {String} classString Klasse als String, welche entfernt wird
 */
function removeClass (element, classString) {
  element.classList.remove(classString);
}

/**
 * Fügt ein Element in ein anderes ein.
 * Optional lässt sich auch die Position festlegen
 * @param {Element} outer Element, in das eingefügt wird
 * @param {Element} inner Element, welches eingefügt wird
 * @param {Number} position OPTIONAL Position, an welcher eingefügt wird (0 = vorne)
 */
function addElement (outer, inner, position) {
  if (!outer.children || (position && outer.children.length <= position)) {
    outer.appendChild(inner);
  } else {
    outer.insertBefore(inner, outer.children[position]);
  }
}

/**
 * Fügt in ein Element ein Array aus Elementen ein.
 * Ganz analog zu addElement(), nur das mehrere Elemente gleichzeitig eingefügt werden können
 * @param {Element} outer  Element, in das eingefügt wird
 * @param {Array<Element>} arrayOfInner Array von Elementen die eingefügt werden
 */
function addElements (outer, arrayOfInner) {
  for (const inner of arrayOfInner) {
    addElement(outer, inner);
  }
}

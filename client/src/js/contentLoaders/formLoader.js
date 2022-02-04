/**
 * -----------------------------------------------------------------------------
 * Läd und koordiniert Inputformulare
 * -----------------------------------------------------------------------------
 */

const {
  createElement,
  addClass,
  removeClass,
  addElement,
  addElements
} = require('../helpers/domHelper.js');
const { SITE } = require('../templates.js');

/**
 * Erstellt <form>-Element aus Datenobjekt
 * @param {Object} json Object mit allen Informationen, um daraus eine <form> zu generieren
 * @returns {HTMLElement}
 */
async function createFormFromJSON (json) {
  let idCounter = 0; // Zählvariable, um eindeutige IDs generieren zu können
  // Erstellt einzelnen Inputabschnitt (Beschreibung des Inputs und Input selbst)
  const createFormElement = async function (inputJSON) {
    const inputID = `input-${idCounter}`;

    const wrapper = createElement('div', { class: 'form-group' });
    const label = createElement('label', { for: inputID, text: inputJSON.description });
    let input;
    switch (inputJSON.type) {
      case 'text':
        input = createElement('input', {
          class: 'form-control inputField',
          type: 'text',
          id: inputID,
          placeholder: inputJSON.placeholder,
          required: inputJSON.required
        });
        break;
      case 'select':
        input = createElement('select', {
          class: 'form-control inputField',
          id: inputID,
          required: inputJSON.required
        });
        break;
      case 'number':
        input = createElement('input', {
          class: 'form-control inputField',
          type: 'number',
          id: inputID,
          placeholder: inputJSON.placeholder,
          required: inputJSON.required
        });
        break;
      case 'date':
        input = createElement('input', {
          class: 'form-control inputField',
          type: 'date',
          id: inputID,
          required: inputJSON.required
        });
        break;
      case 'time':
        input = createElement('input', {
          class: 'form-control inputField',
          type: 'time',
          id: inputID,
          required: inputJSON.required
        });
        break;
    }

    // Input und Tooltip müssen in ein Div mit bestimmten Bootstrapklassen gepackt werden
    const inputWrapper = createElement('div');
    // Alles zusammenstecken
    addElement(inputWrapper, input);

    if (inputJSON.required) {
      addClass(inputWrapper, 'input-group');
      addClass(inputWrapper, 'has-validation');
      // Kleiner roter Text, der bei ungültiger Eingabe angezeigt wird
      // Sofern ein Errortext für dieses Feld definiert ist, wird dieser angezeigt,
      // ansonsten wird der Placeholdertextangezeigt (siehe templates.js)
      const tooltip = createElement('div', { class: 'invalid-tooltip', text: 'Pflichtfeld' });
      addElement(inputWrapper, tooltip);
    }
    addElements(wrapper, [label, inputWrapper]);

    // Counter hochzählen (für eindeutige IDs)
    idCounter++;
    return wrapper;
  };
  // <form>-Element erstellen und füllen
  const form = createElement('form', { class: 'p-4 needs-validation', id: 'form' });
  for (const inputJSON of json.inputs) {
    addElement(form, await createFormElement(inputJSON));
  }
  const submitButton = createElement('button', { text: 'Absenden', type: 'button', id: `submitButton-${json.buttonId}`, class: 'btn btn-outline-light' });
  submitButton.addEventListener('click', handleSubmitClick);
  addElement(form, submitButton);
  return form;
}

/**
 * Setzt benötigte Eventlistener an Inputfelder. Dies ist in zwei Fällen von Feldern notwendig
 * 1. Das Inputfeld hat eine spezielle Validierungsbedingung
 *    z.b Kinoname noch nicht vorhanden, Ticketanzahl noch verfügbar
 * 2. Der Inhalt des Feldes beeinflusst die Validierungsfunktion anderer Felder
 *    Ob die Eingabe in 'Anzahl Tickets' ok ist, hängt damit zusammen, welcher Film im Dropdown ausgewählt ist
 */
async function attachFormularEventlisteners () {
  // ------- Interne Hilfsfunktionen -------

  /**
   * Setzt Felder in den Fehlermodus(roter Rand, Meldung), oder entfernt Fehlermodus
   * @param {HTMLElement} element Element, wessen Validierungszustand gesetzt werden soll
   * @param {Boolean} isOk Ob Element in Ordnung ist, oder ob Fehlermodus angezeigt werden soll
   * @param {String} errorText Text der Fehlermeldung
   */
  const manageValidationState = function (element, isOk, errorText) {
    const errorElement = element.nextSibling;
    if (isOk) {
      errorElement.innerHTML = 'Pflichtfeld';
      removeClass(element, 'is-invalid');
    } else {
      errorElement.innerHTML = errorText;
      addClass(element, 'is-invalid');
    }
  };

  /**
   * Fügt Eventlistener an Element an.
   * Alle davor angehangenen Eventlistener werden entfernt
   * @param {HTMLElement} element Element, für welches der Eventlistener (neu) gesetzt wird
   * @param {Function} fn Neuer Eventlistener
   * @param {String} eventName Name des Events (z.B 'change' oder 'click')
   */
  const refreshEvent = function (element, fn, eventName) {
    // Für detachEventListener() fehlt hier die Referenz auf die Funktion...
    // Durch Ersetzen des Elements durch cloneNode() werden allerdings auch alle Eventlistener entfernt
    const replacedElement = element.cloneNode(true);
    element.replaceWith(replacedElement);

    // Neuen Listener setzen
    replacedElement.addEventListener(eventName, fn);
  };
  const currentSite = require('../router.js').getCurrentSite();
  // ------- Eigentliches Programm -------
  if (currentSite === SITE.KINOSAAL_ANLEGEN) {
    // ------- Kinoname muss eindeutig sein -------
    const nameInput = document.getElementById('input-0');
    // Alle bereits verwendeten Kinonamen
    const allCinemas = await (await window.fetch('/api/getCinemas')).json();
    const occupiedNames = allCinemas.map(cinema => cinema.kinoname);
    const eventListenerName = function (event) {
      const element = event.target;
      const currentValue = element.value;
      const isOk = occupiedNames.every(name => name !== currentValue);
      manageValidationState(element, isOk, 'Dieser Name ist bereits vergeben');
    };
    // Eventlistener anhängen
    refreshEvent(nameInput, eventListenerName, 'input');
    // ------- Anzahl Reihen/Sitze pro Reihe müssen positiv sein -------
    const rowInput = document.getElementById('input-1');
    const colInput = document.getElementById('input-2');
    const eventListenerPosInput = function (event) {
      const element = event.target;
      const currentValue = element.value;
      const isOk = !currentValue || currentValue > 0;
      manageValidationState(element, isOk, 'Geben Sie bitte eine positive Zahl ein');
    };
    // Eventlistener anhängen
    refreshEvent(rowInput, eventListenerPosInput, 'input');
    refreshEvent(colInput, eventListenerPosInput, 'input');
  } else if (currentSite === SITE.VORSTELLUNG_ANLEGEN) {
    // ------- Vorstellungsname muss eindeutig sein -------
    const nameInput = document.getElementById('input-0');
    // Alle bereits verwendetenVorstellungsnamen
    const allShows = await (await window.fetch('/api/getShows')).json();
    console.log(allShows);
    const occupiedNames = allShows.map(show => show.filmname);
    const eventListener = function (event) {
      const element = event.target;
      const currentValue = element.value;
      const isOk = occupiedNames.every(name => name !== currentValue);
      manageValidationState(element, isOk, 'Dieser Name ist bereits vergeben');
    };
    // Eventlistener anhängen
    refreshEvent(nameInput, eventListener, 'input');
  } else if (currentSite === SITE.TICKETS_RESERVIEREN) {
    // ------- Anzahl Tickets muss verfügbar sein -------

    /**
     * Setzt Eventlistener für den TicketInput, welcher schaut, ob die Eingabe in Ordnung ist
     * oder ob ein Fehlertext angezeigt werden soll
     */
    const attachTicketCountValidator = async function (_event) {
      // Anzahl Restplätze für aktuell ausgewählte Vorstellung abfragen
      const dropdown = document.getElementById('input-1');
      const allShows = await (await window.fetch('/api/getShows')).json();
      const currentShowName = dropdown.value;
      const currentShow = allShows.find(show => show.filmname === currentShowName);
      const maxTickets = currentShow.restplaetze;

      const ticketInput = document.getElementById('input-2');

      // Ticketinput initial leer, ohne Error (Also auch bei Dropdownwechsel)
      ticketInput.value = '';
      manageValidationState(ticketInput, true);

      const eventListener = function (event) {
        const element = event.target;
        const currentValue = element.value;
        const isPositive = currentValue > 0;
        const isAvailable = currentValue <= maxTickets;
        const errorText = !isPositive
          ? 'Geben Sie bitte eine positive Zahl ein'
          : `Es sind leider nur noch ${maxTickets} Tickets verfügbar`;
        const isOk = !currentValue || (isPositive && isAvailable);
        manageValidationState(element, isOk, errorText);
      };
      // Eventlistener anhängen
      refreshEvent(ticketInput, eventListener, 'input');
    };

    // ------- Wahl von neuer Vorstellung im Dropdown muss Validierungsfunktion von AnzahlTickets neu setzen -------
    const dropdown = document.getElementById('input-1');
    refreshEvent(dropdown, attachTicketCountValidator, 'change');

    // Validierfunktion initial setzen
    attachTicketCountValidator();
  }
}

/**
 * Wird bei Klick auf Absenden aufgerufen und schaut ob das Formular korrekt ist:
 * Formular korrekt --> Absenden an Datenbank
 * Formular inkorrekt --> Fehlerhafte Fehler anzeigen
 * @param {Event} event Klickevent
 */
async function handleSubmitClick (event) {
  // Holt sich Button und Form
  const submitButton = event.target;
  const form = submitButton.parentNode;

  // Es müssen zwei Bedingungen erfüllt sein, damit das Formular abgesendet werden kann:
  // 1. Alle Pflichtfelder müssen gefüllt sein
  const checkRequiredFieldsStatus = function () {
    return form.checkValidity();
  };
  // Alle Sonderbedingungen (Eindeutige Namen, Tickets verfügbar) müssen erfüllt sein
  const checkSpecialConditionsStatus = function () {
    const allInputs = require('../helpers/inputHelper.js').getInputs();
    return allInputs.every(input => !input.classList.contains('is-invalid'));
  };
  // Boolean, ob Bedingungen erfüllt
  const isOk = checkRequiredFieldsStatus() && checkSpecialConditionsStatus();

  if (isOk) {
    // Antrag abschicken
    await startSubmit();

    // Falls das Formular abgeschickt wird, nachdem der Benutzer seine EIngaben korrigieren musste,
    // befindet sich die Form immernoch im 'Leuchtmodus' (alles Falsche popt auf)
    // Da nach dem Abschicken das Formular geleert wird, würden viele Felder direkt rot aufleuchten
    // Das muss nicht sein --> Leuchtmodus verlassen
    removeClass(form, 'was-validated');
  } else {
    // Form wechselt in den 'Leuchtmodus' (alles Falsche popt auf)
    addClass(form, 'was-validated');
  }
}

/**
 * Event, wenn auf den Absendbutton eines Formulars geklickt wurde
 */
async function startSubmit () {
  const currentSite = require('../router.js').getCurrentSite();
  switch (currentSite) {
    case SITE.VORSTELLUNG_ANLEGEN:
      require('../popup.js').togglePopup(currentSite);
      await require('../api/sendData.js').createVorstellung();
      break;
    case SITE.KINOSAAL_ANLEGEN:
      require('../popup.js').togglePopup(currentSite);
      await require('../api/sendData.js').createKinosaal();
      break;
    case SITE.TICKETS_RESERVIEREN:
      require('../popup.js').togglePopup(currentSite);
      await require('../api/sendData.js').createReservierung();
      break;
    default:
      console.log('Error');
  }
  await attachFormularEventlisteners();
}

module.exports = {
  createFormFromJSON: createFormFromJSON,
  attachFormularEventlisteners: attachFormularEventlisteners
};

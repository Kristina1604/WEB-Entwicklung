const {
  createElement,
  removeElement,
  addElement,
  addElements,
  addClass
} = require('./domHelper.js');

const { SITE } = require('./templates.js');
const { createQrDiv } = require('./qrCode.js');
/**
 * Öffnet die Popupansicht (also ausgegrauter Hintergrund und Popup)
*/
function togglePopup (currentSite) {
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
  const popupHeader = createElement('div', { class: 'popupHeader', text: 'Vielen Dank!' });
  const popupContent = createPopupContent(currentSite);
  const popupFooter = createElement('div', { class: 'popupFooter' });
  const acceptButton = createElement('button', { text: 'Alles klar', class: 'acceptButton btn btn-primary' });

  // Buttonclick soll das Popup schließen
  acceptButton.addEventListener('click', closePopup);

  // Alles zusammenstecken
  addElement(popupFooter, acceptButton);
  addElements(popupWrapper, [popupHeader, popupContent, popupFooter]);
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

function createPopupContent (currentSite) {
  let content;
  // Läd Inhalt für Popup
  switch (currentSite) {
    case SITE.KINOSAAL_ANLEGEN:
      content = createElement('div', { text: 'Neuer Kinosaal erfolgreich angelegt' });
      break;
    case SITE.VORSTELLUNG_ANLEGEN:
      content = createElement('div', { text: 'Neue Vorstellung erfolgreich angelegt' });
      break;
    case SITE.TICKETS_RESERVIEREN:
      content = createElement('div', { text: 'Ticket reserviert. Weitere Informationen finden Sie hier:' });
      addElement(content, createQrDiv(getInputData()));
      break;
  }
  addClass(content, 'popupContent');
  return content;
}

function getInputData () {
  const name = document.getElementById('input-0').value;
  const vorstellung = document.getElementById('input-1').value;
  const anzahlTickets = document.getElementById('input-2').value;
  return { name, vorstellung, anzahlTickets };
}

/**
 * Platziert das Popup horizontal zentriert, oben anliegend, im Formularteil des Menüs
 * Es wird dann noch um einen festen Wert (marginTop) nach unten geschoben
 */
function adjustPopupPosition () {
  console.log('adjust');
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

module.exports = togglePopup;

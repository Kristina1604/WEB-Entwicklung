/**
 * -----------------------------------------------------------------------------
 * Koordiniert Navigationsleiste
 * -----------------------------------------------------------------------------
 */

const {
  addClass,
  removeClass
} = require('./helpers/domHelper.js');
const { switchSite } = require('./router.js');

const initNavBar = function () {
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
};

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

module.exports = {
  initNavBar: initNavBar
};

const { addElement } = require('./helpers/domHelper.js');
const {
  SITE,
  FORMULAR_TEMPLATES
} = require('./templates.js');

// ----------------------
let CURRENTSITE = SITE.VORSTELLUNGEN_ANZEIGEN;
/**
 * Getter für CURRENTSITE
 * @returns currentSite
 */
function getCurrentSite () {
  return CURRENTSITE;
}

/**
 * Koordiniert "Seitenwechsel" (Richtiges Formular laden)
 * @param {String} newSite Name der neuen Seite
 */
async function switchSite (newSite) {
  // Klick auf Seite, die bereits offen ist, hat keine Wirkung
  if (newSite === CURRENTSITE) {
    return;
  }
  // Alten Inhalt entfernen
  clearCurrentSite();
  // Neuer Seitenwert in globalen Variablen hinterlegen
  CURRENTSITE = newSite;

  // Passendes Formular laden
  if (newSite === SITE.VORSTELLUNGEN_ANZEIGEN) {
    await require('./contentLoaders/listLoader.js').loadPresentationList();
  } else if (newSite === SITE.KINOSÄLE_ANZEIGEN) {
    await require('./contentLoaders/listLoader.js').loadRoomList();
  } else {
    // Formular (ohne Dropdown-Options) laden und einfügen
    const form = await require('./contentLoaders/formLoader.js').createFormFromJSON(FORMULAR_TEMPLATES[newSite]);
    const formularWrapper = document.getElementById('formular');
    addElement(formularWrapper, form);

    // Mögliche Dropdowns befüllen
    if (CURRENTSITE === SITE.TICKETS_RESERVIEREN) {
      require('./api/loadData.js').loadShows();
    } else if (CURRENTSITE === SITE.VORSTELLUNG_ANLEGEN) {
      require('./api/loadData.js').loadCinemas();
    }

    // Formular-Eventlistener anhängen
    await require('./contentLoaders/formLoader.js').attachFormularEventlisteners();
  }
}

function clearCurrentSite () {
  const formularWrapper = document.getElementById('formular');
  formularWrapper.innerHTML = '';
  require('./contentLoaders/listLoader.js').removeListpageButtons();
  CURRENTSITE = SITE.EMPTY;
}

module.exports = {
  switchSite: switchSite,
  getCurrentSite: getCurrentSite
};

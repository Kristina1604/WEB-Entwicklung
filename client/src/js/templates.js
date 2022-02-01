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
  VORSTELLUNGEN_ANZEIGEN: 'homeButton',
  KINOSÄLE_ANZEIGEN: 'kinosäleAnzeigen'
};
Object.freeze(SITE);

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
        type: 'text',
        required: true
      },
      {
        description: 'Vorstellung',
        placeholder: 'Wählen Sie eine Vorstellung',
        type: 'select',
        required: false,
        options: []
      },
      {
        description: 'Anzahl Tickets',
        placeholder: 'Wie viele Tickets wollen Sie bestellen?',
        type: 'number',
        required: true
      }

    ]
  },
  kinosaalAnlegen: {
    buttonId: 'kinosaalAnlegen',
    inputs: [
      {
        description: 'Name',
        placeholder: 'Geben Sie den Namen des Kinosaals ein',
        type: 'text',
        required: true
      },
      {
        description: 'Anzahl Reihen',
        placeholder: 'Wählen Sie die Anzahl der Reihen',
        type: 'number',
        required: true
      },
      {
        description: 'Anzahl Sitze pro Reihe',
        placeholder: 'Wählen Sie die Anzahl der Sitze pro Reihe',
        type: 'number',
        required: true
      }

    ]
  },
  vorstellungAnlegen: {
    buttonId: 'vorstellungAnlegen',
    inputs: [
      {
        description: 'Name',
        placeholder: 'Geben Sie den Namen der Vorstellung ein',
        type: 'text',
        required: true
      },
      {
        description: 'Kinosaal',
        placeholder: 'Wählen Sie einen Kinosaal',
        type: 'select',
        required: true,
        options: []
      },
      {
        description: 'Uhrzeit',
        type: 'time',
        required: true
      },
      {
        description: 'Datum',
        type: 'date',
        required: true
      }

    ]
  }
};
Object.freeze(FORMULAR_TEMPLATES);

module.exports = {
  SITE: SITE,
  FORMULAR_TEMPLATES: FORMULAR_TEMPLATES
};

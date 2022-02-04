/**
 * -----------------------------------------------------------------------------
 * Kümmert sich um das Auslesen und Leeren der Inputfelder (nicht überall verwendet)
 * -----------------------------------------------------------------------------
 */
/**
 * Gibt Array aller aktuellen Inputelemente zurück
 * @returns {Array<HTMLElement>}
 */
function getInputs () {
  const inputs = [];
  let counter = 0;
  // Geht alle IDs durch (input-0, input-1, ...) und speichert die Elemente in einem Array ab,
  // bis zum Ersten mal eine ID nicht vorhanden ist (Suche fertig)
  while (true) {
    const input = document.getElementById('input-' + counter);
    if (input) {
      inputs.push(input);
    } else {
      break;
    }
    counter++;
  }
  return inputs;
}

/**
 * Leert alle aktuellen Inputs
 */
function clearInputs () {
  getInputs().forEach(input => {
    // Durchläuft alle Inputelemente und leert Sie (ausser Dropdowns(<select>), die müssen nicht geleert werden)
    if (input.nodeName !== 'SELECT') {
      input.value = '';
    }
  });
}

module.exports = {
  getInputs: getInputs,
  clearInputs: clearInputs
};

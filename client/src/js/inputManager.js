// Kümmert sich um das Auslesen und Leeren der Inputfelder

/**
 * Gibt Array aller aktuellen Inputelemente zurück
 * @returns {Array<HTMLElement>}
 */
function getInputs () {
  const inputs = [];
  let counter = 0;
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
 * Gibt alle Werte der aktuellen Inputs als Array zurück
 * @returns {Array<String>}
 */
function getInputValues () {
  return getInputs().map(input => input.value);
}

/**
 * Leert alle aktuellen Inputs
 */
function clearInputs () {
  getInputs().forEach(input => { input.value = ''; });
}

module.exports = {
  getInputs: getInputs,
  getInputValues: getInputValues,
  clearInputs: clearInputs
};

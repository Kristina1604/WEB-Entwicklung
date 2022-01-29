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
 * Leert alle aktuellen Inputs
 */
function clearInputs () {
  getInputs().forEach(input => {
    if (input.nodeName !== 'SELECT') {
      input.value = '';
    }
  });
}

module.exports = {
  getInputs: getInputs,
  clearInputs: clearInputs
};

/* eslint-disable no-tabs */
const button = document.getElementById('submitButton-vorstellungAnlegen');
button.addEventListener('click', createMessage);

function createMessage () {
  const textArea = document.getElementById('input-0').value;
  const textArea2 = document.getElementById('input-1').value;
  const textArea3 = document.getElementById('input-2').value;

  console.log(textArea);
  const text = { textArea, textArea2, textArea3 };
  console.log(text);

  fetch('/addVortellung', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(text)

  });
}

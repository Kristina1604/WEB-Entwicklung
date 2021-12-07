const buttonBetreiber = document.getElementById('buttonBetreiber');
buttonBetreiber.addEventListener('click', createMessageBetreiber);

function createMessageBetreiber () {
  console.log('Ich bin ein Betreiber');
}

const buttonKunde = document.getElementById('buttonKunde');
buttonKunde.addEventListener('click', createMessageKunde);

function createMessageKunde () {
  console.log('Ich bin ein Kunde');
}

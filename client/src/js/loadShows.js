// loadShow();
async function loadShow () {
  const response = await window.fetch('/api/load/shows');
  const filme = await response.json();

  console.log(filme);

  const selectBox = document.getElementById('input-1');

  for (let count = 0; count < filme.length; count++) {
    const option = document.createElement('option');
    option.text = filme[count].filmname;
    selectBox.options[count] = option;
  }
}

exports.loadShow = loadShow;

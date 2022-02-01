// loadShow();
async function getShows () {
  const response = await window.fetch('/api/getShows');
  const filme = await response.json();
  return filme;
}

exports.getShows = getShows;

// loadShow();
async function getShows () {
  const response = await window.fetch('/api/load/shows');
  const filme = await response.json();
  return filme;
}

exports.getShows = getShows;

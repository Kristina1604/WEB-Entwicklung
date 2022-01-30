async function getCinemas () {
  const response = await window.fetch('/api/load/cinemas');
  const cinema = await response.json();
  return cinema;
}

exports.getCinemas = getCinemas;

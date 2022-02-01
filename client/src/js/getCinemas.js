async function getCinemas () {
  const response = await window.fetch('/api/getCinemas');
  const cinema = await response.json();
  return cinema;
}

exports.getCinemas = getCinemas;

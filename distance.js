const CABIN = { lat: 45.961804, lng: 14.035149 };

let dirService;
let $result;

function initDistanceTool() {
  dirService = new google.maps.DirectionsService();
  $result    = document.getElementById('distance-result');

  document
    .getElementById('distance-form')
    .addEventListener('submit', handleSubmit);
}

function updateResult(text) {
  const el = $result;
  el.classList.remove('show');
  el.textContent = text;
  void el.offsetWidth;
  el.classList.add('show');
}

function handleSubmit(e) {
  e.preventDefault();

  const destination = document.getElementById('dest-input').value.trim();
  if (!destination) {
    return updateResult('Please enter a destination.');
  }

  dirService.route(
    {
      origin:      CABIN,
      destination,
      travelMode:  google.maps.TravelMode.DRIVING
    },
    (res, status) => {
      if (status === 'OK') {
        const leg      = res.routes[0].legs[0];
        const distText = leg.distance.text;
        const durText  = leg.duration.text;
        updateResult(`≈ ${distText} (${durText} by car)`);
      } else {
        console.error('Directions request failed:', status);
        updateResult('Could not calculate distance.');
      }
    }
  );
}

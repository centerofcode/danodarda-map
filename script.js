async function loadPlaces() {
  const response = await fetch('data/places.geojson');
  const geojson = await response.json();
  return geojson.features.map(f => ({
    name: f.properties.name,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
  }));
}
async function initAR() {
  const places = await loadPlaces();
  const scene = document.querySelector('a-scene');
  places.forEach(place => {
    const label = document.createElement('a-text');
    label.setAttribute('gps-entity-place', `latitude: ${place.lat}; longitude: ${place.lon};`);
    label.setAttribute('value', place.name);
    label.setAttribute('look-at', '[gps-camera]');
    label.setAttribute('scale', '20 20 20');
    label.setAttribute('color', '#FFD700');
    scene.appendChild(label);
  });
}
function initMap() {
  const map = L.map('map').setView([23.663828, 72.251989], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  fetch('data/places.geojson')
    .then(r => r.json())
    .then(geojson => {
      L.geoJSON(geojson, {
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<b>${feature.properties.name}</b>`);
        }
      }).addTo(map);
    });
}
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-view');
  const arScene = document.getElementById('ar-scene');
  const mapContainer = document.getElementById('map-container');
  let arVisible = true;
  initAR(); initMap();
  toggle.addEventListener('click', () => {
    arVisible = !arVisible;
    arScene.style.display = arVisible ? 'block' : 'none';
    mapContainer.style.display = arVisible ? 'none' : 'block';
    toggle.textContent = arVisible ? 'Switch to 2D Map' : 'Switch to Live View';
  });
});

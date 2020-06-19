let map;
let service;
let marker;

/**
 * Initialize page
 */
function init() {
  // Add event where pressing "Enter" on the input will trigger Search button
  const input = document.getElementById('search-input');
  input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) { // "Enter" key on keyboard
      event.preventDefault();
      input.parentElement.querySelector('button').click();
    }
  });
}

/**
 * Initializes map
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.276683, lng: 103.799544},
    zoom: 15,
  });
  service = new google.maps.places.PlacesService(map);
  marker = new google.maps.Marker({
    map: map,
    visible: false,
  });
}

/**
 * Function called when the search button is clicked
 */
function handleSearch() {
  const text = document.getElementById('search-input').value;
  const request = {
    query: text,
    type: 'restaurant',
  };
  service.textSearch(request, handleSearchCallback);
}

/**
 * Callback for places library
 * @param {*} results
 * @param {*} status
 */
function handleSearchCallback(results, status) {
  const resultsTable = document.getElementById('search-results-tbody');
  resultsTable.innerHTML = `
    <tr>
      <th>Icon</th>
      <th>Name</th>
      <th>Address</th>
      <th>Status</th>
    </tr>`;
  results.map((result) => {
    const row = document.createElement('tr');
    row.className = 'cursor-pointer';
    row.onclick = () => handleResultClick(result);
    row.innerHTML = `
      <td><img src="${result.icon}"></td>
      <td>${result.name}</td>
      <td>${result.formatted_address}</td>
      <td>${result.business_status}</td>`;
    resultsTable.append(row);
  });
}

/**
 * Handles when a row of the table is clicked
 * @param {*} result
 */
function handleResultClick(result) {
  const {location, viewport} = result.geometry;
  map.fitBounds(viewport);
  marker.setPosition(location);
  marker.setVisible(true);
}

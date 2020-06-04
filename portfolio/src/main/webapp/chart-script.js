google.charts.load('current', {'packages': ['corechart']});

const MIN_DATE = new Date(Date.UTC(2020, 0, 22)); // 22 Jan 2020

let data = {};
let date;
const dropdownValues = ['Singapore', 'China', 'Malaysia'];
const dropdownIsSelected = [false, false, false];
const dropdownCheckboxElements = [];

/**
 * initializes data
 */
function init() {
  initDropdown();
  update();
  const countries = ['Singapore', 'China'];
  const countriesParam = countries.join();
  fetch('/covid-data?countries=' + countriesParam)
      .then((response) => response.json())
      .then((obj) => {
        data = obj;
        drawChart();
      });
}

/**
 * Initializes dropdown
 */
function initDropdown() {
  const dropdown = document.getElementById('dropdown');

  const header = document.createElement('div');
  header.innerText = 'Select Countries';
  header.className = 'dropdown-button';
  dropdown.appendChild(header);

  const checkboxes = document.createElement('div');
  checkboxes.className = 'dropdown-menu';
  for (let i = 0; i < dropdownValues.length; i++) {
    const value = dropdownValues[i];

    const row = document.createElement('div');
    const label = document.createElement('label');
    label.className = 'dropdown-item';
    row.appendChild(label);
    checkboxes.appendChild(row);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onclick = () => dropdownItemOnClick(i);
    label.appendChild(checkbox);
    dropdownCheckboxElements.push(checkbox);

    const text = document.createElement('span');
    text.innerText = value;
    label.appendChild(text);
  }
  checkboxes.style.display = 'none';
  dropdown.appendChild(checkboxes);

  // show/hide dropdown menu on click
  header.onclick = () => {
    if (checkboxes.style.display == 'none') {
      checkboxes.style.display = 'block';
    } else {
      checkboxes.style.display = 'none';
    }
  };
  dropdownUpdateUI();
}

/**
 * Updates state for dropdown menu
 * @param {number} index
 */
function dropdownItemOnClick(index) {
  dropdownIsSelected[index] = !dropdownIsSelected[index];
  const value = dropdownValues[index];
  dropdownUpdateUI();
}

/**
 * Updates dropdown UI based on global states
 */
function dropdownUpdateUI() {
  const header = document.getElementById('dropdown')
      .querySelector('.dropdown-button');
  const dropdownSelectedValues = [];
  for (let i = 0; i < dropdownCheckboxElements.length; i++) {
    dropdownCheckboxElements[i].checked = dropdownIsSelected[i];
    if (dropdownIsSelected[i]) {
      dropdownSelectedValues.push(dropdownValues[i]);
    }
  }

  header.innerText = dropdownSelectedValues.length == 0 ?
    'Select Countries' :
    dropdownSelectedValues.join(', ');
}

/** Redraws chart based on date selected. */
function drawChart() {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Country');
  dataTable.addColumn('number', 'Cases');

  for (const country in data) {
    if (data.hasOwnProperty(country)) {
      const unixTime = date.getTime() / 1000;
      dataTable.addRow([country, data[country][unixTime]]);
    }
  }

  const options = {
    'title': 'Covid Cases',
    'width': 600,
    'height': 300,
    'legend': {position: 'none'},
  };

  const chart = new google.visualization.BarChart(
      document.getElementById('chart-container'));
  chart.draw(dataTable, options);
}

/**
 * Throttles a function. The function can be called at most once in limit
 * milliseconds.
 * @param {function} func
 * @param {number} limit - The limit of the function in milliseconds
 * @return {function}
 */
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const drawChartThrottle = throttle(drawChart, 100);

/**
 * Slider range update
 */
function update() {
  const dateLabel = document.getElementById('date-label');
  const range = document.getElementById('dayRange');

  date = addDays(MIN_DATE, parseInt(range.value));
  dateLabel.innerText = date.toLocaleDateString();

  drawChartThrottle();
}

/**
 * Adds number of days to date
 * @param {Date} date
 * @param {number} days
 * @return {Date}
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

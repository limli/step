google.charts.load('current', {'packages': ['corechart']});

const MIN_DATE = new Date(Date.UTC(2020, 0, 22)); // 22 Jan 2020

let data = {};
let date;
const checkboxValues = ['Singapore', 'China', 'Malaysia'];
const checkboxElements = [];

/**
 * initializes data
 */
function init() {
  initSelector();
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
 * Initializes country selector
 */
function initSelector() {
  const countrySelector = document.getElementById('country-selector');

  const checkboxes = document.createElement('ul');
  for (let i = 0; i < checkboxValues.length; i++) {
    const value = checkboxValues[i];

    const item = document.createElement('li');
    const label = document.createElement('label');
    item.appendChild(label);
    checkboxes.appendChild(item);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    label.appendChild(checkbox);
    checkboxElements.push(checkbox);

    const text = document.createElement('span');
    text.innerText = value;
    label.appendChild(text);
  }
  countrySelector.appendChild(checkboxes);
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

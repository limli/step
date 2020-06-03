google.charts.load('current', {'packages': ['corechart']});
// google.charts.setOnLoadCallback(drawChart);

const MIN_DATE = new Date('1/22/20');

let data = {};
let date = '';

/**
 * initializes data
 */
function init() {
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

/** Fetches bigfoot sightings data and uses it to create a chart. */
function drawChart() {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Country');
  dataTable.addColumn('number', 'Cases');

  for (const country in data) {
    if (data.hasOwnProperty(country)) {
      dataTable.addRow([country, data[country][date]]);
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
 * Throttles a function
 * @param {function} func
 * @param {number} limit
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
  const range = document.getElementById('myRange');
  dateLabel.innerText =
   date =
   dateToString(addDays(MIN_DATE, parseInt(range.value)));
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

/**
 * Converts date to M/D/YY format
 * @param {Date} date
 * @return {String}
 */
function dateToString(date) {
  return (date.getMonth() + 1) + '/' +
    date.getDate() + '/' +
    date.getFullYear().toString().substr(-2);
}

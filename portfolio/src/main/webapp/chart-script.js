google.charts.load('current', {'packages': ['corechart']});
// google.charts.setOnLoadCallback(drawChart);

const MIN_DATE = new Date('1/22/20');

let data = {};
let date = '4/10/20';

/**
 * initializes data
 */
function init() {
  const countries = ['Singapore', 'China'];
  const countriesParam = countries.join();
  fetch('/covid-data?countries=' + countriesParam)
      .then((response) => response.json())
      .then((obj) => {
        data = obj;
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
 * aa
 */
function update() {
  const dateLabel = document.getElementById('date-label');
  const range = document.getElementById('myRange');
  dateLabel.innerText =
   date =
   dateToString(addDays(MIN_DATE, parseInt(range.value)));
  drawChart();
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

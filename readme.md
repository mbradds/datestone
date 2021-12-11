### datestone

Apply a range of dates to a long list of values. Useful for saving on data transfer/bundle size as the "date column" can be removed from the dataset, and applied at run time.

## Installation

```bash
npm i datestone
```

## Why use datestone?

Most time series datasets contain "predictable" dates. Each row has a unique date (if not, the data can be easily shaped to have a unique date) that is usually ordered, and usually incremented by a predictable time duration each row (daily data, monthly data, etc).

Serialized JSON dates take up alot of space. A dataset containing two columns (a daily date and a random decimal number rounded to 3 decimal places) and 100 rows takes up approximately 3.7 kb of disk space. Without the date column the size drops to 1.6 kb, or 57% smaller.

When dealing with large time series datasets that need to be sent over the network or bundled into your production code, the savings can be massive. A dataset like the one described above, but with 50,000 rows can shed just over 1Mb when using datestone, even after the datestone distribution code is included.

## How it works

```javascript
import datestone from "datestone";

// this data is going to take up too much space in our bundle!
let dataWithDate = [
    ["2015-01-01", 0.0284],
    ["2015-01-02", 0.5701],
  ...
];

// delete the "date" column in the backend first!
let dataWithoutDate = [0.0284, 0.5701]

// dataForChart will now mirror "dataWithDate"
let dataForChart = datestone.mapDatesToList(dataWithoutDate, new Date(2015, 1,1), "daily")

// Highcharts use case
Highcharts.chart('container', {
    chart: {
        type: 'line'
    },

    tooltip: {
        valueDecimals: 2
    },

    xAxis: {
        type: 'datetime'
    },

    series: [{
        data: dataForChart,
        name: 'Daily data points'
    }]

});
```

datestone has the capability to fill dates forwards (starting date) or backwards (ending date), as well as transform the "data" column with an optional unit conversion. The best part? There is no combination of parameters that results in anything other than a single pass over the array, without any conditionals evaluated on each data point. Higher order functions are "teed up" at run time to facilitate ultra fast data processing.

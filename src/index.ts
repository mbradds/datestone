function changeValue(u) {
  let valueTransformer;
  if (u.base !== u.current) {
    valueTransformer = function convert(row) {
      return row ? row * u.conversion : null;
    };
  } else {
    valueTransformer = function dontConvert(row) {
      return row;
    };
  }
  return valueTransformer;
}

function addDate(f, i, outFormat) {
  const dFunc = (d) => d.setDate(d.getDate() + i);
  const mFunc = (d) => d.setMonth(d.getMonth() + i);
  const yFunc = (d) => d.setFullYear(d.getFullYear() + i);

  let datePlusPlus;
  if (f === "daily" || f === "d") {
    datePlusPlus = dFunc;
  } else if (f === "monthly" || f === "m") {
    datePlusPlus = mFunc;
  } else if (f === "yearly" || f === "y") {
    datePlusPlus = yFunc;
  }
  if (outFormat === "date" || outFormat === "d") {
    return function milliToDate(d) {
      return new Date(datePlusPlus(d));
    };
  }
  return datePlusPlus;
}

function addRow(units, freq, increment, outFormat) {
  const dateFunction = addDate(freq, increment, outFormat);
  const rowFunction = changeValue(units);
  return function adder(row, startDate) {
    const nextDate = dateFunction(startDate);
    return [nextDate, rowFunction(row)];
  };
}

export function applyDates({
  series,
  date,
  transform = false,
  frequency = "monthly",
  outputFormat = "number",
  method = "forward",
}) {
  let increment = 1;
  if (method === "backward" || method === "b") {
    increment = -1;
  }

  let startd;
  if (typeof date !== "date") {
    startd = new Date(date[0], date[1], date[2]);
  } else {
    startd = date;
  }

  const addFunction = addRow(transform, frequency, increment, outputFormat);
  const nextSeries = series.map((row) => {
    const [nextDate, rowCalc] = addFunction(row, startd);
    return [nextDate, rowCalc];
  });

  return nextSeries;
}


const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const myDateRange = applyDates({
  series: testData,
  date: [2015, 1, 1],
  //   outputFormat: "date",
});
console.log(myDateRange);
module.exports = applyDates;

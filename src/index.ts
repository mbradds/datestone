interface Units {
  conversion: number;
  operation: string;
  convert: boolean;
}

interface DateFunction {
  (d: Date): number;
}

function changeValue(u: Units) {
  let valueTransformer;
  if (u.convert) {
    valueTransformer = function convert(row: number) {
      return row ? row * u.conversion : null;
    };
  } else {
    valueTransformer = function dontConvert(row: number) {
      return row;
    };
  }
  return valueTransformer;
}

function addDate(f: string, i: number, outFormat: string) {
  const dFunc: DateFunction = (d) => d.setDate(d.getDate() + i);
  const mFunc: DateFunction = (d) => d.setMonth(d.getMonth() + i);
  const yFunc: DateFunction = (d) => d.setFullYear(d.getFullYear() + i);

  let datePlusPlus: DateFunction = mFunc;
  if (f === "daily" || f === "d") {
    datePlusPlus = dFunc;
  } else if (f === "monthly" || f === "m") {
    datePlusPlus = mFunc;
  } else if (f === "yearly" || f === "y") {
    datePlusPlus = yFunc;
  }
  if (outFormat === "date" || outFormat === "d") {
    return function milliToDate(d: Date) {
      return new Date(datePlusPlus(d));
    };
  }
  return datePlusPlus;
}

function addRow(
  units: Units,
  freq: string,
  increment: number,
  outFormat: string
) {
  const dateFunction = addDate(freq, increment, outFormat);
  const rowFunction = changeValue(units);
  return function adder(row: number, startDate: Date) {
    const nextDate = dateFunction(startDate);
    return [nextDate, rowFunction(row)];
  };
}

export function applyDates(
  series: number[],
  date: Date,
  transform = { convert: false, operation: "none", conversion: 0 },
  frequency = "monthly",
  outputFormat = "number",
  method = "forward"
) {
  let increment = 1;
  if (method === "backward" || method === "b") {
    increment = -1;
  }

  const addFunction = addRow(transform, frequency, increment, outputFormat);
  const nextSeries = series.map((row) => {
    const [nextDate, rowCalc] = addFunction(row, date);
    return [nextDate, rowCalc];
  });

  return nextSeries;
}

// const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const testDate = [2015, 1, 1];
// const myDateRange = applyDates(
//   testData,
//   new Date(testDate[0], testDate[1], testDate[2])
// );



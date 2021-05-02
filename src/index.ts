type Units = {
  conversion: number;
  operation: string;
  convert: boolean;
};

type NewRow = {
  dateNew: number;
  valueNew: any;
};

type DateFunction = {
  (d: Date, i: number): number;
};

type Adder = {
  (row: number, startDate: Date): NewRow;
};

function changeValue(u: Units) {
  let valueTransformer;
  const dontConvert = function noTransform(row: number) {
    return row;
  };
  if (u.convert) {
    if (u.operation === "*") {
      valueTransformer = function convert(row: number) {
        return row ? row * u.conversion : null;
      };
    } else if (u.operation === "/") {
      valueTransformer = function convert(row: number) {
        return row ? row / u.conversion : null;
      };
    } else if (u.operation === "+") {
      valueTransformer = function convert(row: number) {
        return row ? row + u.conversion : null;
      };
    } else if (u.operation === "-") {
      valueTransformer = function convert(row: number) {
        return row ? row - u.conversion : null;
      };
    } else {
      valueTransformer = dontConvert;
    }
  } else {
    valueTransformer = dontConvert;
  }
  return valueTransformer;
}

function getDateFunction(frequency: string) {
  const dFunc: DateFunction = (d, i) => d.setDate(d.getDate() + i);
  const mFunc: DateFunction = (d, i) => d.setMonth(d.getMonth() + i);
  const yFunc: DateFunction = (d, i) => d.setFullYear(d.getFullYear() + i);

  let datePlusPlus: DateFunction = mFunc;
  if (frequency === "daily" || frequency === "d") {
    datePlusPlus = dFunc;
  } else if (frequency === "monthly" || frequency === "m") {
    datePlusPlus = mFunc;
  } else if (frequency === "yearly" || frequency === "y") {
    datePlusPlus = yFunc;
  }

  return datePlusPlus;
}

function addRow(units: Units, increment: number, datePlusPlus: DateFunction) {
  const rowFunction = changeValue(units);
  const adder: Adder = (row: number, startDate: Date) => {
    const nextDate = datePlusPlus(startDate, increment);
    return { dateNew: nextDate, valueNew: rowFunction(row) };
  };

  return adder;
}

export function mapDates(
  series: number[],
  date: Date,
  frequency = "monthly",
  method = "forward",
  transform = { convert: false, operation: "none", conversion: 0 }
) {
  let increment = 1;
  if (method === "backward" || method === "b") {
    increment = -1;
  }

  // date needs to be de-incremented by one unit to avoid if statement checking for first date addition
  const datePlusPlus = getDateFunction(frequency);
  const dateMinusOne = new Date(datePlusPlus(date, -1));

  const addFunction = addRow(transform, increment, datePlusPlus);
  const seriesWithDate = series.map((row) => {
    const { dateNew, valueNew } = addFunction(row, dateMinusOne);
    return [dateNew, valueNew];
  });

  return seriesWithDate;
}

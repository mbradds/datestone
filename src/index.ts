type Units = {
  conversion: number;
  operation: string;
  convert: boolean;
  round: number;
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
  const convertNoRound = (row: number) => {
    return row * u.conversion;
  };
  const convertWithRound = (row: number) => {
    return parseFloat((row * u.conversion).toFixed(u.round));
  };
  let rowFunction = convertNoRound;
  if (u.round >= 0) {
    rowFunction = convertWithRound;
  }

  if (u.convert) {
    if (u.operation === "*") {
      valueTransformer = function convert(row: number) {
        return row ? rowFunction(row) : null;
      };
    } else if (u.operation === "/") {
      valueTransformer = function convert(row: number) {
        return row ? rowFunction(row) : null;
      };
    } else if (u.operation === "+") {
      valueTransformer = function convert(row: number) {
        return row ? rowFunction(row) : null;
      };
    } else if (u.operation === "-") {
      valueTransformer = function convert(row: number) {
        return row ? rowFunction(row) : null;
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

export function mapDatesToList(
  series: number[],
  date: Date,
  frequency = "monthly",
  method = "forward",
  transform = { convert: false, operation: "none", conversion: 0, round: -1 }
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

export function mapDatesToJson(
  series: any[],
  date: Date,
  valueCol: string,
  dateCol = "date",
  frequency = "monthly",
  method = "forward",
  transform = { convert: false, operation: "none", conversion: 0, round: -1 }
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
    const value: number = row[valueCol]
    const newRow = row
    const { dateNew, valueNew } = addFunction(value, dateMinusOne);
    newRow[dateCol] = dateNew
    newRow[valueCol] = valueNew
    return newRow;
  });

  return seriesWithDate;
}
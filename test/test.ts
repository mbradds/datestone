import test from "ava";
import { mapDatesToList, mapDatesToJson, fillBetween } from "../dist/index.js";

// no data conversion
const testData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const testDate1 = [2015, 0, 1];
const range1 = mapDatesToList(
  testData1,
  new Date(testDate1[0], testDate1[1], testDate1[2]),
  "m",
  "date"
);

// data conversion
const testData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const range2 = mapDatesToList(
  testData2,
  new Date(testDate1[0], testDate1[1], testDate1[2]),
  "m",
  "date",
  { convert: true, operation: "*", conversion: 6.2898, round: 4 }
);

test("input/output same length", (t) => {
  t.is(testData1.length, range1.length);
});

test("min date accurate", (t) => {
  const minYear = new Date(range1[0][0]);
  t.is(minYear.getFullYear(), 2015);
  t.is(minYear.getMonth(), 0);
  t.is(minYear.getDate(), 1);
});

test("max date accurate", (t) => {
  const minYear = new Date(range1.slice(-1)[0][0]);
  t.is(minYear.getFullYear(), 2015);
  t.is(minYear.getMonth(), 9);
  t.is(minYear.getDate(), 1);
});

test("conversion values", (t) => {
  const firstVal = range2[0][1];
  t.is(firstVal, 1 * 6.2898);
  t.is(testData2[0], 1);
});

// test dates applied to json

// no data conversion
const testData3 = [{ value: 1 }, { value: 2 }, { value: 3 }];
const testDate3 = [2015, 0, 1];
const range3 = mapDatesToJson(
  testData3,
  new Date(testDate3[0], testDate3[1], testDate3[2]),
  "value",
  "date"
);

test("min json date accurate", (t) => {
  const minYear = new Date(range3[0].date);
  t.is(minYear.getFullYear(), 2015);
  t.is(minYear.getMonth(), 0);
  t.is(minYear.getDate(), 1);
});

test("fill between dates", (t) => {
  const value = 5;
  const series = fillBetween([2015, 0, 1], [2015, 11, 31], value);
  t.is(series.length, 365);
  t.is(series[0][1], value);
});

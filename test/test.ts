import test from "ava";
import { mapDates } from "../dist/index.js";

// no data conversion
const testData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const testDate1 = [2015, 0, 1];
const range1 = mapDates(
  testData1,
  new Date(testDate1[0], testDate1[1], testDate1[2]),
  "m",
  "date"
);

// data conversion
const testData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const range2 = mapDates(
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
  let minYear = new Date(range1[0][0]);
  t.is(minYear.getFullYear(), 2015);
  t.is(minYear.getMonth(), 0);
  t.is(minYear.getDate(), 1);
});

test("max date accurate", (t) => {
  let minYear = new Date(range1.slice(-1)[0][0]);
  t.is(minYear.getFullYear(), 2015);
  t.is(minYear.getMonth(), 9);
  t.is(minYear.getDate(), 1);
});

test("conversion values", (t) => {
  let firstVal = range2[0][1];
  t.is(firstVal, 1 * 6.2898);
  t.is(testData2[0], 1);
});

import test from "ava";
import { applyDates } from "./src/index.js";

// const test = require("ava");
// const applyDates = require("./src/index.js");

const testData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const range1 = applyDates({ series: testData1, date: [2015, 1, 1] });

test("length", (t) => {
  t.is(testData1.length, range1.length);
});
console.log(range1);
// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });

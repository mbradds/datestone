import test from "ava";
import { applyDates } from "./dist/index.js";

const testData1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const testDate1 = [2015, 1, 1];
const range1 = applyDates(
  testData1,
  new Date(testDate1[0], testDate1[1], testDate1[2])
);

test("length", (t) => {
  t.is(testData1.length, range1.length);
});
console.log(range1);
// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });

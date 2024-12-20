#!/usr/bin/env node

import minimist from "minimist";

const params = minimist(process.argv.slice(2));

const today = new Date();
const month = params.m ?? today.getMonth() + 1;
const year = params.y ?? today.getFullYear();

const start_of_month = new Date(year, month - 1);
const end_of_month = new Date(year, start_of_month.getMonth() + 1, 0);

console.log(`      ${month}月 ${year}     `);
console.log("日 月 火 水 木 金 土");
process.stdout.write(" ".repeat(3 * start_of_month.getDay()));

for (
  const day = new Date(start_of_month);
  day <= end_of_month;
  day.setDate(day.getDate() + 1)
) {
  process.stdout.write(`${String(day.getDate()).padStart(2, " ")} `);
  if (day.getDay() === 6) {
    process.stdout.write("\n");
  }
}
process.stdout.write("\n\n");

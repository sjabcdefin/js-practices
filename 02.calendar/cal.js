#!/usr/bin/env node

import minimist from "minimist";

const params = minimist(process.argv.slice(2));

const today = new Date();
const month = params.m ?? today.getMonth() + 1;
const year = params.y ?? today.getFullYear();

const startDate = new Date(year, month - 1);
const endDate = new Date(year, startDate.getMonth() + 1, 0);

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(startDate.getDay()));

let numberOfLines = 0;

for (
  const date = new Date(startDate);
  date <= endDate;
  date.setDate(date.getDate() + 1)
) {
  process.stdout.write(`${String(date.getDate()).padStart(2, " ")}`);
  if (date.getDay() === 6) {
    process.stdout.write("\n");
    numberOfLines++;
  } else {
    process.stdout.write(" ");
  }
}

for (let lines = numberOfLines; lines < 6; lines++) {
  process.stdout.write("\n");
}

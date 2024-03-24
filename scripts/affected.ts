#!/usr/bin/env node

import { execSync } from "child_process";

const [target, base] = process.argv.slice(2);
//const result = execSync(`nx print-affected --base=${base} --select=projects`, { encoding: "utf-8" })
const result = execSync(`npx lerna ls --since=${base}`, { encoding: "utf-8" })
  .trim()
  .split(", ")
  .join(" ");

console.log(result);

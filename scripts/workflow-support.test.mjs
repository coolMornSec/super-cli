import assert from "node:assert/strict";
import { parseImplementationLanes, normalizeLanes } from "./workflow-support.mjs";

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest("normalizeLanes preserves platform-docs", () => {
  assert.deepEqual(normalizeLanes("platform-docs"), ["platform-docs"]);
});

runTest("normalizeLanes preserves no-code", () => {
  assert.deepEqual(normalizeLanes("no-code"), ["no-code"]);
});

runTest("normalizeLanes preserves frontend and backend-java order", () => {
  assert.deepEqual(normalizeLanes("frontend,backend-java"), ["frontend", "backend-java"]);
});

runTest("normalizeLanes throws on unknown explicit lane", () => {
  assert.throws(() => normalizeLanes("unknown-lane"), /Unknown implementation lane: unknown-lane/);
});

runTest("parseImplementationLanes does not silently fallback for unknown lane", () => {
  assert.throws(() => parseImplementationLanes("platform-docs,ghost"), /Unknown implementation lane: ghost/);
});

runTest("parseImplementationLanes defaults blank value to frontend", () => {
  assert.deepEqual(parseImplementationLanes(""), ["frontend"]);
});

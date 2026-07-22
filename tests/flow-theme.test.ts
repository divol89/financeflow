import assert from "node:assert/strict";
import test from "node:test";
import {
  getNextFlowTheme,
  isFlowTheme,
  resolveFlowTheme,
} from "../lib/flowFinance/theme";

test("stored Flow theme overrides the system preference", () => {
  assert.equal(resolveFlowTheme("light", true), "light");
  assert.equal(resolveFlowTheme("dark", false), "dark");
});

test("Flow theme falls back to the system preference", () => {
  assert.equal(resolveFlowTheme(null, true), "dark");
  assert.equal(resolveFlowTheme("invalid", false), "light");
});

test("Flow theme values and toggles stay bounded", () => {
  assert.equal(isFlowTheme("light"), true);
  assert.equal(isFlowTheme("dark"), true);
  assert.equal(isFlowTheme("system"), false);
  assert.equal(getNextFlowTheme("light"), "dark");
  assert.equal(getNextFlowTheme("dark"), "light");
});

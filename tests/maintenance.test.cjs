const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", "require", code)(
    mod,
    mod.exports,
    (n) => mocks[n] ?? require(n),
  );
  return mod.exports;
}
const { validateTaskPayload } = require("../backend/src/lib/taskValidation");
test("due date and tag roundtrip normalize correctly", () =>
  assert.deepEqual(
    validateTaskPayload(
      { title: " Plan ", dueDate: "2026-10-25", tag: " Work " },
      { requireTitle: true },
    ).updates,
    { title: "Plan", dueDate: "2026-10-25", tag: "Work" },
  ));
test("rejects impossible dates, malformed and overlong tags", () => {
  for (const p of [
    { dueDate: "2026-02-31" },
    { dueDate: "not-date" },
    { tag: "x".repeat(51) },
    { tag: { bad: true } },
  ])
    assert.ok(validateTaskPayload(p).errors.length);
});
test("can clear deadline and tag", () =>
  assert.deepEqual(validateTaskPayload({ dueDate: "", tag: "" }).updates, {
    dueDate: null,
    tag: "",
  }));
test("rejects non-string task content", () => {
  assert.ok(
    validateTaskPayload({ title: { bad: true } }, { requireTitle: true }).errors
      .length,
  );
  assert.ok(validateTaskPayload({ description: [] }).errors.length);
});
const { filterTasks, shouldClearSession } = load("src/lib/taskUtils.ts");
const tasks = [
  {
    id: "1",
    title: "Write report",
    description: "Quarterly",
    tag: "work",
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    title: "Read",
    description: "Book",
    tag: "home",
    priority: "low",
    status: "done",
  },
];
test("task search combines text, status and priority", () => {
  assert.equal(filterTasks(tasks, "WORK", "todo", "high").length, 1);
  assert.equal(filterTasks(tasks, "WORK", "done", "high").length, 0);
});
test("only unauthorized clears a session", () => {
  assert.equal(shouldClearSession({ status: 401 }), true);
  for (const x of [
    new Error("offline"),
    { status: 503 },
    { status: 429 },
    null,
  ])
    assert.equal(shouldClearSession(x), false);
});

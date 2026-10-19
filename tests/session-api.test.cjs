const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
function load(file, mocks = {}) {
  let source = fs
    .readFileSync(file, "utf8")
    .replace(/const API_BASE_URL = .*?;/, 'const API_BASE_URL = "/api";');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const m = { exports: {} };
  new Function("module", "exports", "require", code)(
    m,
    m.exports,
    (n) => mocks[n] ?? require(n),
  );
  return m.exports;
}
const values = new Map();
global.localStorage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, String(v)),
  removeItem: (k) => values.delete(k),
};
global.window = { localStorage: global.localStorage };
const utils = load("src/lib/taskUtils.ts");
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
let failure;
const taskApi = {};
const { useAuthStore, useTaskStore } = load("src/store/index.ts", {
  "../api": {
    default: {
      tasks: taskApi,
      auth: {
        me: async () => {
          throw failure;
        },
      },
    },
    ApiError,
  },
  "../lib/taskUtils": utils,
});
test("temporary outage preserves token while rejecting unverified session", async () => {
  values.set("token", "fixture-token");
  failure = new ApiError("offline", 503);
  await useAuthStore.getState().initializeAuth();
  assert.equal(values.get("token"), "fixture-token");
  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().isInitialized, true);
});
test("unauthorized response removes token", async () => {
  values.set("token", "expired");
  failure = new ApiError("expired", 401);
  await useAuthStore.getState().initializeAuth();
  assert.equal(values.has("token"), false);
});
test("logout clears previously loaded tasks", () => {
  useTaskStore.setState({ tasks: [{ id: "private" }] });
  useAuthStore.getState().logout();
  assert.equal(useTaskStore.getState().tasks.length, 0);
});
const { api } = load("src/api/index.ts");
test("API sends deadline and tag and transforms the response", async () => {
  const old = global.fetch;
  try {
    global.fetch = async (url, init) => {
      assert.deepEqual(JSON.parse(init.body), {
        title: "Plan",
        dueDate: "2026-10-25",
        tag: "work",
      });
      assert.ok(init.signal);
      return new Response(
        JSON.stringify({
          _id: "1",
          title: "Plan",
          dueDate: "2026-10-25",
          tag: "work",
        }),
      );
    };
    const t = await api.tasks.create({
      title: "Plan",
      dueDate: "2026-10-25",
      tag: "work",
    });
    assert.equal(t.dueDate, "2026-10-25");
    assert.equal(t.tag, "work");
  } finally {
    global.fetch = old;
  }
});
test("malformed sign-in response never becomes a successful session", async () => {
  const old = global.fetch;
  try {
    global.fetch = async () => new Response("{}");
    await assert.rejects(
      api.auth.login({ email: "test@example.invalid", password: "fixture" }),
      /Invalid sign-in response/,
    );
  } finally {
    global.fetch = old;
  }
});

test("late create response cannot repopulate tasks after logout", async () => {
  values.set("token", "old");
  let resolve;
  taskApi.create = () => new Promise((r) => (resolve = r));
  const pending = useTaskStore
    .getState()
    .addTask({ title: "Private", status: "todo", priority: "high" });
  useAuthStore.getState().logout();
  resolve({ id: "private", title: "Private" });
  await pending;
  assert.equal(useTaskStore.getState().tasks.length, 0);
});
test("stale unauthorized task response cannot sign out a new account", async () => {
  values.set("token", "old");
  let reject;
  taskApi.getAll = () => new Promise((_, r) => (reject = r));
  const pending = useTaskStore.getState().fetchTasks();
  useAuthStore.getState().logout();
  values.set("token", "new");
  useAuthStore.getState().setUser({ id: "new" });
  reject(new ApiError("expired", 401));
  await pending;
  assert.equal(values.get("token"), "new");
  assert.equal(useAuthStore.getState().isAuthenticated, true);
});

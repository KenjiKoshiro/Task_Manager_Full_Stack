const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const express = require("express");
const mongoose = require("mongoose");
const records = [];
class Task {
  constructor(data) {
    Object.assign(this, data);
    this._id = new mongoose.Types.ObjectId().toString();
  }
  async save() {
    if (!records.includes(this)) records.push(this);
  }
  static db = { base: mongoose };
  static async findOne(query) {
    return records.find(
      (t) => t._id === query._id && t.userId === query.userId,
    );
  }
  static find(query) {
    return {
      sort: async () => records.filter((t) => t.userId === query.userId),
    };
  }
}
const mod = { exports: {} };
new Function(
  "require",
  "module",
  fs.readFileSync("backend/src/routes/tasks.js", "utf8"),
)(
  (name) =>
    name === "express"
      ? express
      : name === "../models/Task"
        ? Task
        : name === "../middleware/auth"
          ? (req, res, next) => {
              req.user = { id: req.headers["x-fixture-user"] || "one" };
              next();
            }
          : require("../backend/src/lib/taskValidation"),
  mod,
);
test("task routes save/edit/clear deadlines and enforce owner lookup", async () => {
  const app = express();
  app.use(express.json());
  app.use("/tasks", mod.exports);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/tasks`;
  try {
    let r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Plan",
        dueDate: "2026-10-25",
        tag: "Work",
      }),
    });
    assert.equal(r.status, 201);
    let t = await r.json();
    assert.equal(t.dueDate, "2026-10-25");
    assert.equal(t.tag, "Work");
    r = await fetch(url + "/" + t._id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate: "", tag: "" }),
    });
    t = await r.json();
    assert.equal(t.dueDate, null);
    assert.equal(t.tag, "");
    r = await fetch(url + "/" + t._id, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-fixture-user": "two" },
      body: JSON.stringify({ title: "Hijack" }),
    });
    assert.equal(r.status, 404);
    r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Invalid", dueDate: "2026-02-31" }),
    });
    assert.equal(r.status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

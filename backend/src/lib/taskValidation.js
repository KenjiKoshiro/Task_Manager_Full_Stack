const VALID_STATUSES = ["todo", "in-progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

const validateTaskPayload = (payload = {}, { requireTitle = false } = {}) => {
  const errors = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return { errors: ["Task must be an object"], updates: {} };
  const updates = {};

  if (requireTitle || payload.title !== undefined) {
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    if (typeof payload.title !== "string") errors.push("Title must be text");

    if (!title) {
      errors.push("Title is required");
    } else {
      updates.title = title;
    }
  }

  if (payload.description !== undefined) {
    if (typeof payload.description !== "string" && payload.description !== null)
      errors.push("Description must be text");
    else updates.description = payload.description?.trim() ?? "";
  }

  if (payload.status !== undefined) {
    if (!VALID_STATUSES.includes(payload.status)) {
      errors.push("Status must be todo, in-progress, or done");
    } else {
      updates.status = payload.status;
    }
  }

  if (payload.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(payload.priority)) {
      errors.push("Priority must be low, medium, or high");
    } else {
      updates.priority = payload.priority;
    }
  }

  if (payload.dueDate !== undefined) {
    const value = payload.dueDate;
    if (value === "" || value === null) updates.dueDate = null;
    else if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value + "T12:00:00Z")) ||
      new Date(value + "T12:00:00Z").toISOString().slice(0, 10) !== value
    )
      errors.push("Due date must be a valid YYYY-MM-DD date");
    else updates.dueDate = value;
  }
  if (payload.tag !== undefined) {
    if (typeof payload.tag !== "string" || payload.tag.trim().length > 50)
      errors.push("Tag must be text up to 50 characters");
    else updates.tag = payload.tag.trim();
  }
  return { errors, updates };
};

module.exports = { validateTaskPayload };

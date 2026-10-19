import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTaskStore } from "../store";
import { Plus, Pencil, X } from "lucide-react";
import { filterTasks } from "../lib/taskUtils";
import type { Task, TaskStatus, TaskPriority } from "../types";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "in-progress", title: "In progress" },
  { id: "done", title: "Done" },
];
const emptyForm = {
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  status: "todo" as TaskStatus,
  dueDate: "",
  tag: "",
};

export default function TasksPage() {
  const {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    isLoading,
    error,
  } = useTaskStore();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<"board" | "list">("board");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [dragged, setDragged] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    if (params.get("new") === "1") setOpen(true);
  }, [params]);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
    } else dialog.current?.close();
  }, [open]);
  const visible = filterTasks(tasks, query, status, priority);
  function close() {
    if (saving) return;
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
  }
  function edit(task: Task) {
    setEditing(task);
    setForm({
      ...emptyForm,
      ...task,
      dueDate: task.dueDate ?? "",
      tag: task.tag ?? "",
    });
    setOpen(true);
  }
  async function move(id: string, next: TaskStatus) {
    try {
      await updateTask(id, { status: next });
      setNotice("Task status updated.");
    } catch {
      setNotice("Task could not be moved. Please retry.");
    } finally {
      setDragged(null);
    }
  }
  async function remove(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`))
      return;
    try {
      await deleteTask(task.id);
      setNotice("Task deleted.");
    } catch {
      setNotice("Task could not be deleted. Please retry.");
    }
  }

  function card(task: Task) {
    return (
      <article
        key={task.id}
        draggable
        onDragStart={() => setDragged(task.id)}
        onDragEnd={() => setDragged(null)}
        className="task-card"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs uppercase text-[#adc6ff]">
            {task.priority} priority
          </span>
          <div className="flex gap-1">
            <button
              aria-label={`Edit ${task.title}`}
              onClick={() => edit(task)}
            >
              <Pencil size={18} aria-hidden="true" />
            </button>
            <button
              aria-label={`Delete ${task.title}`}
              onClick={() => void remove(task)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <h4 className="text-lg font-semibold my-2 break-words">{task.title}</h4>
        <p className="text-sm text-[#c2c6d6] whitespace-pre-wrap break-words">
          {task.description}
        </p>
        <div className="flex flex-wrap gap-3 my-4 text-sm text-[#c2c6d6]">
          <span>{task.dueDate ? `Due ${task.dueDate}` : "No due date"}</span>
          {task.tag && <span className="break-words">#{task.tag}</span>}
        </div>
        <label className="task-field">
          Status for {task.title}
          <select
            value={task.status}
            disabled={isLoading}
            onChange={(e) => void move(task.id, e.target.value as TaskStatus)}
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
      </article>
    );
  }
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">My tasks</h2>
          <p className="text-[#c2c6d6]">
            Plan your work, set deadlines, and track progress.
          </p>
        </div>
        <button
          className="task-primary"
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus size={18} aria-hidden="true" /> New task
        </button>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="task-field">
          Search tasks
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, description or tag"
          />
        </label>
        <label className="task-field">
          Filter status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="task-field">
          Filter priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All priorities</option>
            {["low", "medium", "high"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <p role="status">
          {notice || `${visible.length} of ${tasks.length} tasks`}
        </p>
        <div className="flex gap-2">
          <button
            aria-pressed={view === "board"}
            onClick={() => setView("board")}
          >
            Board
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            onClick={() => {
              setQuery("");
              setStatus("all");
              setPriority("all");
            }}
          >
            Reset filters
          </button>
        </div>
      </div>
      {error && (
        <div role="alert" className="task-card text-[#ffb4ab]">
          {error}{" "}
          <button onClick={() => void fetchTasks()}>Retry loading tasks</button>
        </div>
      )}
      {isLoading && <p role="status">Updating tasks…</p>}
      {!isLoading && !error && visible.length === 0 && (
        <p className="task-card">
          No tasks match. Reset your filters or create a task to get started.
        </p>
      )}
      <div
        className={
          view === "board" ? "grid gap-5 lg:grid-cols-3" : "grid gap-4"
        }
      >
        {view === "board"
          ? COLUMNS.map((c) => (
              <section
                key={c.id}
                className="min-w-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragged) void move(dragged, c.id);
                }}
              >
                <h3 className="font-semibold mb-4">
                  {c.title} · {visible.filter((t) => t.status === c.id).length}
                </h3>
                <div className="space-y-4">
                  {visible.filter((t) => t.status === c.id).map(card)}
                </div>
              </section>
            ))
          : visible.map(card)}
      </div>
      <dialog
        ref={dialog}
        className="task-dialog"
        onCancel={(e) => {
          if (saving) e.preventDefault();
          else close();
        }}
        onClose={() => {
          if (!saving) close();
        }}
        aria-labelledby="task-dialog-title"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (saving) return;
            setSaving(true);
            setFormError("");
            try {
              const data = {
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
                tag: form.tag.trim(),
                dueDate: form.dueDate || null,
              };
              if (editing) await updateTask(editing.id, data);
              else await addTask(data);
              setNotice(editing ? "Task updated." : "Task created.");
              setOpen(false);
              setEditing(null);
              setForm(emptyForm);
            } catch (err) {
              setFormError(
                err instanceof Error ? err.message : "Unable to save task.",
              );
            } finally {
              setSaving(false);
            }
          }}
          className="space-y-5"
        >
          <div className="flex justify-between items-center">
            <h2 id="task-dialog-title" className="text-xl font-bold">
              {editing ? "Edit task" : "New task"}
            </h2>
            <button
              type="button"
              aria-label="Close task form"
              disabled={saving}
              onClick={close}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          {formError && (
            <p role="alert" className="text-[#ffb4ab]">
              {formError}
            </p>
          )}
          <label className="task-field">
            Task title
            <input
              autoFocus
              required
              maxLength={200}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="task-field">
            Description
            <textarea
              rows={3}
              maxLength={5000}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="task-field">
              Priority
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as TaskPriority })
                }
              >
                {["low", "medium", "high"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="task-field">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TaskStatus })
                }
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="task-field">
              Due date
              <input
                type="date"
                onInput={(e) =>
                  setForm({ ...form, dueDate: e.currentTarget.value })
                }
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </label>
            <label className="task-field">
              Tag
              <input
                maxLength={50}
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" disabled={saving} onClick={close}>
              Cancel
            </button>
            <button
              className="task-primary"
              disabled={saving || !form.title.trim()}
              type="submit"
            >
              {saving ? "Saving…" : "Save task"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

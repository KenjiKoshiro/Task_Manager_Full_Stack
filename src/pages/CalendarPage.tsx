import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskStore } from "../store";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export default function CalendarPage() {
  const { tasks, fetchTasks, error, isLoading } = useTaskStore();
  const today = new Date();
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);
  const year = month.getFullYear(),
    index = month.getMonth();
  const first = (month.getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from(
      { length: new Date(year, index + 1, 0).getDate() },
      (_, i) => i + 1,
    ),
  ];
  while (cells.length % 7) cells.push(null);
  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== "done")
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
    .slice(0, 8);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Task calendar</h2>
          <p className="text-[#c2c6d6]">
            Tasks appear on their due date. Tasks without a deadline stay on
            your board.
          </p>
        </div>
        <Link className="task-primary" to="/tasks?new=1">
          New task
        </Link>
      </header>
      {error && (
        <div role="alert" className="task-card">
          {error}
          <button onClick={() => void fetchTasks()}>Retry loading tasks</button>
        </div>
      )}
      {isLoading && <p role="status">Loading deadlines…</p>}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-xl">
          {month.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div>
          <button
            aria-label="Previous month"
            onClick={() => setMonth(new Date(year, index - 1, 1))}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            onClick={() =>
              setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
            }
          >
            Today
          </button>
          <button
            aria-label="Next month"
            onClick={() => setMonth(new Date(year, index + 1, 1))}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="task-card overflow-x-auto">
        <div
          className="min-w-[560px] grid grid-cols-7"
          role="group"
          aria-label="Monthly task deadlines"
        >
          {DAYS.map((d) => (
            <div key={d} className="p-2 text-center font-semibold">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const date = day
              ? `${year}-${String(index + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : "";
            const dayTasks = tasks.filter((t) => t.dueDate === date);
            return (
              <div
                key={i}
                role="group"
                aria-label={date || "Empty day"}
                className="min-h-28 p-2 border border-[#424754]"
              >
                <span className="text-[#c2c6d6]">{day}</span>
                <div className="space-y-2 mt-2">
                  {dayTasks.map((t) => (
                    <Link
                      key={t.id}
                      to={`/tasks?q=${encodeURIComponent(t.title)}`}
                      className="block text-sm break-words text-[#adc6ff]"
                    >
                      {t.status === "done" ? "✓ " : ""}
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <section className="task-card">
        <h3 className="font-semibold text-xl mb-4">Pending deadlines</h3>
        {upcoming.length === 0 ? (
          <p>No pending deadlines. Add a due date to a task to see it here.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((t) => (
              <li key={t.id} className="flex flex-wrap justify-between gap-3">
                <Link
                  to={`/tasks?q=${encodeURIComponent(t.title)}`}
                  className="text-[#adc6ff] break-words"
                >
                  {t.title}
                </Link>
                <span>{t.dueDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

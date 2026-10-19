import type { Task } from "../types";
export function shouldClearSession(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 401
  );
}
export function filterTasks(
  tasks: Task[],
  query: string,
  status: string,
  priority: string,
) {
  const term = query.trim().toLocaleLowerCase();
  return tasks.filter(
    (task) =>
      (status === "all" || task.status === status) &&
      (priority === "all" || task.priority === priority) &&
      `${task.title} ${task.description} ${task.tag ?? ""}`
        .toLocaleLowerCase()
        .includes(term),
  );
}

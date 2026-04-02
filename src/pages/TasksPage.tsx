import { useState, useEffect } from 'react';
import { useTaskStore } from '../store';
import { Plus, MoreHorizontal, Info, X } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#adc6ff' },
  { id: 'in-progress', title: 'In Progress', color: '#ddb7ff' },
  { id: 'done', title: 'Done', color: '#4ade80' },
];

interface Toast { id: number; message: string; sub?: string; type: 'success' | 'error' }

export default function TasksPage() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, isLoading } = useTaskStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetchTasks().then(() => setIsInitialized(true));
  }, [fetchTasks]);

  const addToast = (message: string, sub?: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, sub, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const getTasksByStatus = (s: TaskStatus) => tasks.filter((t) => t.status === s);

  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (s: TaskStatus) => {
    if (draggedTask && draggedTask.status !== s) await updateTask(draggedTask.id, { status: s });
    setDraggedTask(null);
  };

  const resetModal = () => {
    setTitle(''); setDescription(''); setPriority('medium');
    setStatus('todo'); setDueDate(''); setTag('');
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    try {
      await addTask({ title: title.trim(), description: description.trim(), status, priority });
      addToast('Task Created Successfully', 'The Obsidian workspace has been updated.');
      setShowModal(false);
      resetModal();
    } catch {
      addToast('Failed to create task', undefined, 'error');
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTask(id);
      addToast('Success', 'Task Deleted successfully');
    } catch {
      addToast('Failed to delete task', undefined, 'error');
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'text-[#ddb7ff] bg-[#ddb7ff]/10';
    if (p === 'medium') return 'text-[#adc6ff] bg-[#adc6ff]/10';
    return 'text-[#c2c6d6] bg-[#c2c6d6]/10';
  };

  if (!isInitialized || isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="text-[#c2c6d6]">Loading...</div></div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toast notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <div key={toast.id} className="flex items-center gap-3 bg-[#1c1b1b] border border-[#424754]/30 rounded-xl px-5 py-3 shadow-xl min-w-[260px]">
            <div className="w-7 h-7 rounded-full bg-[#adc6ff]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#adc6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-[#e5e2e1] text-sm font-semibold">{toast.message}</p>
              {toast.sub && <p className="text-[#c2c6d6] text-xs">{toast.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1]">Kanban Board</h2>
          <p className="text-[#c2c6d6]/60 text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            {tasks.length} Active blueprints for the current sprint
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1c1b1b] p-1.5 rounded-xl border border-[#424754]/10">
            <button type="button" className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase bg-[#2a2a2a] text-[#e5e2e1] shadow-sm">Board</button>
            <button type="button" className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-[#c2c6d6] hover:text-[#e5e2e1] transition-colors">List</button>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      <div className="flex gap-8 h-full pb-8 overflow-x-auto">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col"
              onDragOver={handleDragOver} onDrop={() => handleDrop(column.id)}>
              <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
                  <h3 className="font-bold text-[#e5e2e1] uppercase tracking-widest text-xs">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#353534] text-[10px] text-[#c2c6d6] font-bold">{columnTasks.length}</span>
                </div>
                <button type="button" className="p-1 hover:text-[#adc6ff] transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#c2c6d6]" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {columnTasks.map((task) => (
                  <div key={task.id} draggable onDragStart={() => handleDragStart(task)}
                    className="bg-[rgba(32,31,31,0.7)] backdrop-blur-xl rounded-xl p-5 pl-7 pr-4 transition-all duration-300 cursor-grab active:cursor-grabbing hover:-translate-y-1 border border-[#424754]/10 hover:border-[#adc6ff] hover:shadow-[0_0_15px_rgba(173,198,255,0.1)] relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all group-hover:opacity-100" style={{ backgroundColor: column.color + '66' }} />
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      <button type="button" onClick={(e) => handleDeleteTask(task.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c2c6d6] hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-[#e5e2e1] mb-2 group-hover:text-[#adc6ff] transition-colors">{task.title}</h4>
                    <p className="text-xs text-[#c2c6d6] line-clamp-2 mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#ddb7ff] flex items-center justify-center text-[8px] text-[#002e6a] font-bold border-2 border-[#201f1f]">TF</div>
                      <span className="text-[10px] text-[#c2c6d6]">{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-[#424754]/30 text-[#c2c6d6] hover:text-[#adc6ff] hover:border-[#adc6ff]/50 transition-all">
                  <Plus className="w-4 h-4" /><span className="text-sm font-medium">Add Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-[#adc6ff]/20 rounded-2xl w-full max-w-lg p-8 relative">
            <button type="button" onClick={() => { setShowModal(false); resetModal(); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-dashed border-[#adc6ff]/40 flex items-center justify-center text-[#c2c6d6] hover:text-[#adc6ff] transition-colors">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-[#e5e2e1] mb-1">Create New Task</h2>
            <p className="text-xs text-[#c2c6d6] mb-6">Define your next milestone in the Obsidian workspace.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Project Name</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design System Refinement"
                  className="w-full bg-[#0e0e1a] border border-[#424754]/30 rounded-lg px-4 py-3 text-[#e5e2e1] text-sm placeholder-[#424754] focus:outline-none focus:border-[#adc6ff]/50" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Brief Overview of the Task...</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the architectural goals and requirements..."
                  rows={3}
                  className="w-full bg-[#0e0e1a] border border-[#424754]/30 rounded-lg px-4 py-3 text-[#e5e2e1] text-sm placeholder-[#424754] focus:outline-none focus:border-[#adc6ff]/50 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Priority</label>
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                      <button key={p} type="button" onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${priority === p ? 'bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/40' : 'bg-[#0e0e1a] text-[#c2c6d6] border border-[#424754]/20 hover:border-[#adc6ff]/20'}`}>
                        {p === 'low' ? 'Low' : p === 'medium' ? 'Med' : 'High'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-[#0e0e1a] border border-[#424754]/30 rounded-lg px-3 py-2 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#adc6ff]/50 appearance-none">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0e0e1a] border border-[#424754]/30 rounded-lg px-3 py-2 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#adc6ff]/50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-2">Tag</label>
                  <input value={tag} onChange={(e) => setTag(e.target.value)}
                    placeholder="UI Design, Backend..."
                    className="w-full bg-[#0e0e1a] border border-[#424754]/30 rounded-lg px-3 py-2 text-[#e5e2e1] text-sm placeholder-[#424754] focus:outline-none focus:border-[#adc6ff]/50" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetModal(); }}
                  className="px-6 py-2.5 rounded-lg border border-dashed border-[#adc6ff]/30 text-[#c2c6d6] hover:text-[#e5e2e1] text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleCreateTask} disabled={!title.trim()}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
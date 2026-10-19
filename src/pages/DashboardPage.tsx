import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useTaskStore } from '../store';
import { BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, isLoading, error } = useTaskStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
      setIsInitialized(true);
    };

    void loadTasks();
  }, [fetchTasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high' && task.status !== 'done');

  const weeklyData = [4, 8, 6, 12, 7, 2, 5];
  const maxValue = Math.max(...weeklyData);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#c2c6d6]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {error && <p role="alert" className="task-card">{error} <button onClick={()=>void fetchTasks()}>Retry loading tasks</button></p>}
      <p className="text-sm text-[#c2c6d6]">Task counts reflect your saved tasks. Activity charts and workspace insights are illustrative design previews.</p>
      <section>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#e5e2e1] mb-2">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-lg text-[#c2c6d6] font-medium">Here&apos;s what&apos;s on your plate today.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[rgba(32,31,31,0.7)] backdrop-blur-xl p-8 rounded-xl border border-[#424754]/10 flex items-center justify-between relative overflow-hidden group">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2c6d6] mb-4">Total Tasks</p>
            <p className="text-6xl font-black text-[#e5e2e1] leading-none">{totalTasks}</p>
          </div>
          <div className="relative z-10 w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-[#2a2a2a]" cx="40" cy="40" fill="transparent" r="35" stroke="currentColor" strokeWidth="6" />
              <circle className="text-[#adc6ff]" cx="40" cy="40" fill="transparent" r="35" stroke="currentColor" strokeDasharray="220" strokeDashoffset="0" strokeWidth="6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="text-[#adc6ff] w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#adc6ff]/5 rounded-full blur-3xl group-hover:bg-[#adc6ff]/10 transition-colors" />
        </div>

        <div className="bg-[rgba(32,31,31,0.7)] backdrop-blur-xl p-8 rounded-xl border border-[#424754]/10 flex items-center justify-between relative overflow-hidden group">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2c6d6] mb-4">Completed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-6xl font-black text-[#ddb7ff] leading-none">{completedTasks}</p>
              <span className="text-sm font-bold text-[#ddb7ff]/60">{completionRate}%</span>
            </div>
          </div>
          <div className="relative z-10 w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-[#2a2a2a]" cx="40" cy="40" fill="transparent" r="35" stroke="currentColor" strokeWidth="6" />
              <circle
                className="text-[#ddb7ff]"
                cx="40"
                cy="40"
                fill="transparent"
                r="35"
                stroke="currentColor"
                strokeDasharray="220"
                strokeDashoffset={220 - (220 * completionRate) / 100}
                strokeWidth="6"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="text-[#ddb7ff] w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#ddb7ff]/5 rounded-full blur-3xl group-hover:bg-[#ddb7ff]/10 transition-colors" />
        </div>

        <div className="bg-[rgba(32,31,31,0.7)] backdrop-blur-xl p-8 rounded-xl border border-[#424754]/10 flex items-center justify-between relative overflow-hidden group">
          <div className="z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2c6d6] mb-4">Pending</p>
            <p className="text-6xl font-black text-[#e5e2e1] leading-none">{pendingTasks}</p>
          </div>
          <div className="relative z-10 w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-[#2a2a2a]" cx="40" cy="40" fill="transparent" r="35" stroke="currentColor" strokeWidth="6" />
              <circle
                className="text-[#ffb4ab]"
                cx="40"
                cy="40"
                fill="transparent"
                r="35"
                stroke="currentColor"
                strokeDasharray="220"
                strokeDashoffset={220 - 220 * (pendingTasks / totalTasks || 0)}
                strokeWidth="6"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="text-[#ffb4ab] w-8 h-8" />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#ffb4ab]/5 rounded-full blur-3xl group-hover:bg-[#ffb4ab]/10 transition-colors" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#201f1f] rounded-xl p-8 border border-[#424754]/10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-[#e5e2e1]">Activity Overview</h3>
              <p className="text-xs text-[#c2c6d6] uppercase tracking-widest mt-1">7 Day Velocity</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#2a2a2a] border border-[#424754]/20 text-[10px] text-[#adc6ff] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#adc6ff]" />
                COMPLETED
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {weeklyData.map((value, index) => {
              const height = (value / maxValue) * 100;
              const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className={`w-full rounded-t-sm relative group-hover:bg-[#adc6ff]/40 transition-colors ${
                      index === 3
                        ? 'bg-[#adc6ff]/40 border-t-2 border-[#adc6ff] shadow-[0_-4px_10px_rgba(173,198,255,0.1)]'
                        : 'bg-[#adc6ff]/20'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#353534] px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#c2c6d6]">{dayLabels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#201f1f] rounded-xl p-8 border border-[#424754]/10 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1]">High Priority</h3>
              <TrendingUp className="text-[#ddb7ff] w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-4">
              {highPriorityTasks.length > 0 ? (
                highPriorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex flex-col p-4 rounded-lg bg-[#1c1b1b] hover:bg-[#2a2a2a] transition-all border-l-4 border-[#ddb7ff] pl-5 pr-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[#e5e2e1] text-sm group-hover:text-[#ddb7ff] transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-[10px] font-bold text-[#ddb7ff] uppercase tracking-widest px-2 py-0.5 rounded bg-[#ddb7ff]/10">
                        Today
                      </span>
                    </div>
                    <p className="text-xs text-[#c2c6d6] line-clamp-1 mb-4">{task.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#c2c6d6] text-sm">No high priority tasks</p>
              )}
            </div>
          </div>

          <div className="bg-[#201f1f] rounded-xl p-6 border border-[#424754]/10">
            <h3 className="text-lg font-bold text-[#e5e2e1] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/tasks"
                className="block w-full text-left px-4 py-3 rounded-lg bg-[#adc6ff]/10 text-[#adc6ff] hover:bg-[#adc6ff]/20 transition-colors text-sm font-medium"
              >
                View All Tasks -&gt;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

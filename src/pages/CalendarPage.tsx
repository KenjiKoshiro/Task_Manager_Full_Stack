import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import { useTaskStore } from '../store';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DEADLINES = [
  { day: '05', month: 'SEP', title: 'API Documentation Review', project: 'Architecture Hub' },
  { day: '08', month: 'SEP', title: 'Client Presentation', project: 'Marketing Strategy' },
  { day: '12', month: 'SEP', title: 'Security Audit v2', project: 'Backend Ops' },
];

export default function CalendarPage() {
  const { tasks } = useTaskStore();
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const year = current.getFullYear();
  const month = current.getMonth();

  // getDay() returns 0=Sun, need Mon-first grid
  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.createdAt?.startsWith(dateStr));
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;

  return (
    <div className="flex gap-6 h-full">
      {/* Main calendar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#e5e2e1]">
              {MONTHS[month]} {year}
            </h2>
            <p className="text-xs text-[#c2c6d6] mt-1 uppercase tracking-widest">
              12 Active Projects • {pendingTasks} Pending Tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#1c1b1b] border border-[#424754]/10 rounded-lg p-1 gap-1">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition-colors ${view === v ? 'bg-[#2a2a2a] text-[#e5e2e1]' : 'text-[#c2c6d6] hover:text-[#e5e2e1]'}`}>
                  {v}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#adc6ff]/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#adc6ff]/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#424754]/10">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] py-3">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayTasks = day ? getTasksForDay(day) : [];
              const borderR = (i + 1) % 7 !== 0;
              const borderB = i < cells.length - 7;

              return (
                <div key={i} className={`min-h-[90px] p-2 ${borderR ? 'border-r' : ''} ${borderB ? 'border-b' : ''} border-[#424754]/10 hover:bg-[#1c1b1b] transition-colors relative group`}>
                  {day && (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold ${
                          isToday ? 'bg-gradient-to-br from-[#adc6ff] to-[#ddb7ff] text-[#002e6a]' : 'text-[#c2c6d6]'
                        }`}>
                          {day}
                          {isToday && <span className="sr-only">TODAY</span>}
                        </span>
                        {isToday && <span className="text-[9px] font-bold text-[#adc6ff] uppercase tracking-wider">Today</span>}
                      </div>
                      <div className="space-y-0.5">
                        {dayTasks.slice(0, 2).map((t) => (
                          <div key={t.id} className={`text-[9px] truncate px-1.5 py-0.5 rounded font-medium ${
                            t.priority === 'high' ? 'bg-[#ddb7ff]/15 text-[#ddb7ff]' : 'bg-[#adc6ff]/15 text-[#adc6ff]'
                          }`}>
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[9px] text-[#c2c6d6] pl-1">+{dayTasks.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="w-56 flex-shrink-0 space-y-5">
        {/* Density Analysis */}
        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#adc6ff] mb-4 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Density Analysis
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c2c6d6]">Weekly Load</span>
                <span className="text-[#e5e2e1] font-bold">82%</span>
              </div>
              <div className="w-full bg-[#2a2a2a] rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff]" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-[#1c1b1b] rounded-lg p-3">
                <p className="text-[9px] uppercase tracking-wider text-[#c2c6d6]">Total Hours</p>
                <p className="text-lg font-black text-[#e5e2e1]">142.5</p>
              </div>
              <div className="bg-[#1c1b1b] rounded-lg p-3">
                <p className="text-[9px] uppercase tracking-wider text-[#c2c6d6]">Focus Score</p>
                <p className="text-lg font-black text-[#e5e2e1]">8.4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] flex items-center gap-1">
              ⏰ Deadlines
            </p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab]">CRITICAL</span>
          </div>
          <div className="space-y-3">
            {DEADLINES.map((d) => (
              <div key={d.title} className="flex gap-3">
                <div className="text-center flex-shrink-0">
                  <p className="text-[9px] font-bold text-[#c2c6d6] uppercase">{d.month}</p>
                  <p className="text-lg font-black text-[#e5e2e1] leading-none">{d.day}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#e5e2e1] leading-tight">{d.title}</p>
                  <p className="text-[9px] text-[#c2c6d6] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] inline-block" />
                    {d.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Insight */}
        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#adc6ff] mb-2">Pro Insight</p>
          <p className="text-xs text-[#c2c6d6] leading-relaxed mb-4">
            Friday afternoons have the lowest task density. Perfect for deep work.
          </p>
          <button type="button" className="w-full flex items-center justify-between text-[10px] font-bold text-[#adc6ff] uppercase tracking-widest hover:text-[#e5e2e1] transition-colors">
            Schedule Focus <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* FAB */}
        <button type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] font-bold text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </aside>
    </div>
  );
}
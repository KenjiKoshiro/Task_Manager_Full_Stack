import { useState } from 'react';
import { UserPlus, Grid, List, TrendingUp, Zap, Users } from 'lucide-react';
import { useTaskStore } from '../store';

const TEAM = [
  { name: 'Elena Volkov', role: 'Lead Architect', initials: 'EV', color: '#adc6ff', status: 'online', tasks: 5, tags: ['BACKEND', 'SCALE'] },
  { name: 'Marcus Chen', role: 'UI Designer', initials: 'MC', color: '#ddb7ff', status: 'online', tasks: 2, tags: ['DESIGN OPS', 'BRAND'] },
  { name: 'Sarah Jenkins', role: 'DevOps Engineer', initials: 'SJ', color: '#ffb4ab', status: 'busy', tasks: 8, tags: ['CRITICAL', 'CLOUD'] },
  { name: 'Leo Rodriguez', role: 'Frontend Lead', initials: 'LR', color: '#4ade80', status: 'online', tasks: 3, tags: ['REACT', 'A11Y'] },
];

const TAG_COLORS: Record<string, string> = {
  BACKEND: 'bg-[#adc6ff]/20 text-[#adc6ff]',
  SCALE: 'bg-[#adc6ff]/10 text-[#adc6ff]',
  'DESIGN OPS': 'bg-[#ddb7ff]/20 text-[#ddb7ff]',
  BRAND: 'bg-[#ddb7ff]/10 text-[#ddb7ff]',
  CRITICAL: 'bg-[#ffb4ab]/20 text-[#ffb4ab]',
  CLOUD: 'bg-[#ffb4ab]/10 text-[#ffb4ab]',
  REACT: 'bg-[#4ade80]/20 text-[#4ade80]',
  A11Y: 'bg-[#4ade80]/10 text-[#4ade80]',
};

const STATUS_COLOR: Record<string, string> = {
  online: 'bg-[#4ade80]',
  busy: 'bg-yellow-400',
  away: 'bg-[#c2c6d6]',
};

export default function TeamPage() {
  const { tasks } = useTaskStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const totalTasks = tasks.length;
  const activeSprints = 12;
  const capacity = 86;
  const velocity = 94.2;
  const weeklyData = [3, 5, 4, 8, 6, 7, 5];
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#e5e2e1] mb-1">Core Infrastructure Team</h2>
          <p className="text-sm text-[#c2c6d6]">
            Managing global distributed systems and high-concurrency architecture.{' '}
            <span className="text-[#adc6ff] font-semibold">8 Members active.</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#424754]/30 text-[#c2c6d6] hover:text-[#e5e2e1] hover:border-[#adc6ff]/30 text-sm font-medium transition-colors">
            Share Access
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff] text-[#002e6a] text-sm font-bold hover:opacity-90 transition-opacity">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocity chart */}
        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-1">Overall Velocity</p>
          <p className="text-4xl font-black text-[#e5e2e1] mb-4">{velocity}%</p>
          <div className="flex items-end gap-1 h-12">
            {weeklyData.map((v, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all"
                style={{ height: `${(v / maxVal) * 100}%`, backgroundColor: i === 3 ? '#adc6ff' : '#adc6ff33' }} />
            ))}
          </div>
        </div>

        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-1">Active Sprints</p>
          <p className="text-4xl font-black text-[#e5e2e1] mb-2">{activeSprints}</p>
          <p className="text-xs text-[#4ade80] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2 since last week
          </p>
        </div>

        <div className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-1">Capacity</p>
          <p className="text-4xl font-black text-[#e5e2e1] mb-3">{capacity}%</p>
          <div className="w-full bg-[#2a2a2a] rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-[#adc6ff] to-[#ddb7ff]" style={{ width: `${capacity}%` }} />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#adc6ff]" /> Team Members
          </h3>
          <div className="flex gap-1 bg-[#1c1b1b] p-1 rounded-lg border border-[#424754]/10">
            <button type="button" onClick={() => setView('grid')}
              className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-[#2a2a2a] text-[#adc6ff]' : 'text-[#c2c6d6] hover:text-[#e5e2e1]'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setView('list')}
              className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-[#2a2a2a] text-[#adc6ff]' : 'text-[#c2c6d6] hover:text-[#e5e2e1]'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {TEAM.map((member) => (
            <div key={member.name} className="bg-[#201f1f] rounded-xl border border-[#424754]/10 p-5 hover:border-[#adc6ff]/30 transition-all group">
              <div className={`flex ${view === 'list' ? 'items-center gap-4' : 'flex-col'}`}>
                <div className="relative mb-3 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#002e6a] font-black text-lg border-2 border-[#424754]/20"
                    style={{ background: `linear-gradient(135deg, ${member.color}99, ${member.color}44)` }}>
                    {member.initials}
                  </div>
                  <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#201f1f] ${STATUS_COLOR[member.status]}`} />
                </div>
                <div className={view === 'list' ? 'flex-1' : ''}>
                  <h4 className="font-bold text-[#e5e2e1] group-hover:text-[#adc6ff] transition-colors">{member.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mt-0.5 mb-3">{member.role}</p>
                  <p className="text-xs text-[#c2c6d6] mb-3">
                    Workload <span className="text-[#e5e2e1] font-bold">{member.tasks} Active Tasks</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.tags.map((tag) => (
                      <span key={tag} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${TAG_COLORS[tag] || 'bg-[#353534] text-[#c2c6d6]'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button type="button" className="text-xs font-medium text-[#adc6ff] hover:underline">View Profile</button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Member */}
          <div className="bg-[#201f1f] rounded-xl border border-dashed border-[#424754]/30 p-5 flex flex-col items-center justify-center gap-2 hover:border-[#adc6ff]/40 transition-all cursor-pointer group min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#adc6ff]/10 transition-colors">
              <Zap className="w-5 h-5 text-[#c2c6d6] group-hover:text-[#adc6ff]" />
            </div>
            <p className="text-sm font-bold text-[#e5e2e1]">Add Member</p>
            <p className="text-xs text-[#c2c6d6]">Fill an empty slot</p>
          </div>
        </div>
      </div>
    </div>
  );
}
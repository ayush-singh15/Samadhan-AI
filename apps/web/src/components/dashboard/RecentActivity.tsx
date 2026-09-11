import React from 'react';

export const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, title: 'IIT Kanpur submitted proposal for Bio-Sand Filter Project', time: '2 hours ago', icon: '🎓' },
    { id: 2, title: 'Tata Trusts committed ₹12 Lakhs CSR Funding to Rampur Project', time: '5 hours ago', icon: '💰' },
    { id: 3, title: 'AI Service auto-assigned Water Quality issue to IIT Kanpur', time: '1 day ago', icon: '🤖' },
    { id: 4, title: 'Citizen Rajesh Kumar reported Solar Storage requirement in Varanasi', time: '2 days ago', icon: '📍' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <span>⚡</span> Live Activity Feed
      </h3>
      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
            <span className="text-lg p-1.5 rounded-lg bg-slate-800 border border-slate-700">{act.icon}</span>
            <div>
              <p className="text-slate-200 font-medium">{act.title}</p>
              <span className="text-[10px] text-slate-500 font-medium">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

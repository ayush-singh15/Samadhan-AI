import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color = 'indigo' }) => {
  const borderColors = {
    indigo: 'border-indigo-500/30 text-indigo-400',
    emerald: 'border-emerald-500/30 text-emerald-400',
    cyan: 'border-cyan-500/30 text-cyan-400',
    amber: 'border-amber-500/30 text-amber-400',
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl border ${borderColors[color]} flex items-center justify-between shadow-lg`}>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="text-2xl font-extrabold text-white mt-1">{value}</div>
        {change && <div className="text-xs text-emerald-400 mt-1 font-semibold">↑ {change} vs last month</div>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
        {icon}
      </div>
    </div>
  );
};

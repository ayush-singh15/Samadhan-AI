import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, role, setUser } = useAuth();

  const handleRoleChange = (newRole: any) => {
    if (user) {
      setUser({ ...user, role: newRole }, 'demo_token');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">🌉</span>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Tri<span className="gradient-text">Setu</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Societal Innovation Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <span className="text-xs text-slate-400 font-semibold px-2">Role Demo:</span>
            <button
              onClick={() => handleRoleChange('CITIZEN')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                role === 'CITIZEN' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => handleRoleChange('UNIVERSITY')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                role === 'UNIVERSITY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              University
            </button>
            <button
              onClick={() => handleRoleChange('INDUSTRY')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                role === 'INDUSTRY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Industry
            </button>
            <button
              onClick={() => handleRoleChange('GOVERNMENT')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                role === 'GOVERNMENT' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gov Analytics
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-indigo-300">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-slate-400">{user.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

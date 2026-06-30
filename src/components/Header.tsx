import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTitle = (tab: string) => {
    if (tab === 'dashboard') return 'Dashboard Overview';
    return tab.charAt(0).toUpperCase() + tab.slice(1) + ' Management';
  };

  const mockNotifications = [
    { id: 1, text: 'Aisha Rahman submitted a sick leave request.', time: '2 hours ago', unread: true },
    { id: 2, text: 'Michael Chen completed his Q2 goals.', time: '5 hours ago', unread: true },
    { id: 3, text: 'Sarah Jenkins approved James Wilson\'s leave.', time: '1 day ago', unread: false },
  ];

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 bg-white/10 dark:bg-slate-900/5 border-b border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md sticky top-0 z-10">
      {/* Left: Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-all m-0!">
          {formatTitle(activeTab)}
        </h1>
      </div>

      {/* Right: Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-white/40 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-xl max-w-xs w-64 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, files..."
            className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm transition-all duration-300 hover:scale-105 relative cursor-pointer"
          >
            <Bell size={18} />
            {mockNotifications.some((n) => n.unread) && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-600 rounded-full animate-ping" />
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl z-30 py-3 overflow-hidden animate-scale-in">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/40 max-h-72 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors flex flex-col gap-1">
                      <p className={`text-xs text-slate-700 dark:text-slate-300 ${n.unread ? 'font-medium' : ''}`}>
                        {n.text}
                      </p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile (HR Manager Elena) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/60 dark:border-slate-800/60">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
            alt="Elena Rostova"
            className="w-9 h-9 rounded-xl object-cover border border-purple-500/25 shadow-sm shrink-0"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
              Elena Rostova
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">
              HR Director
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

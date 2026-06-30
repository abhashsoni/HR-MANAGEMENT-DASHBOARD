import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Star,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'leave', label: 'Leave', icon: FileSpreadsheet },
    { id: 'performance', label: 'Performance', icon: Star },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-20 p-5 bg-white/20 dark:bg-slate-900/10 border-r border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-8">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
            <Layers size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            HRFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 text-center">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            HRFlow v1.0.0
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around p-3 bg-white/70 dark:bg-slate-900/70 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-lg shadow-2xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 scale-110'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { HRProvider } from './context/HRContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Attendance } from './pages/Attendance';
import { Payroll } from './pages/Payroll';
import { Leave } from './pages/Leave';
import { Performance } from './pages/Performance';

const TABS = ['dashboard', 'employees', 'attendance', 'payroll', 'leave', 'performance'];

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Animated page transitions with direction detection
  const handleTabChange = (newTab: string) => {
    const currentIndex = TABS.indexOf(activeTab);
    const newIndex = TABS.indexOf(newTab);

    if (currentIndex === -1 || newIndex === -1 || currentIndex === newIndex) {
      setActiveTab(newTab);
      return;
    }

    const direction = newIndex > currentIndex ? 'forward' : 'backward';

    const doc = document as any;
    if (!doc.startViewTransition) {
      setActiveTab(newTab);
      return;
    }

    doc.startViewTransition({
      update: () => {
        setActiveTab(newTab);
      },
      types: [direction],
    });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees />;
      case 'attendance':
        return <Attendance />;
      case 'payroll':
        return <Payroll />;
      case 'leave':
        return <Leave />;
      case 'performance':
        return <Performance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HRProvider>
        <AppContent />
      </HRProvider>
    </ToastProvider>
  );
};

export default App;

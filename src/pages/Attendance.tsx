import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import type { Attendance as AttendanceType } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const { employees, attendance, logAttendance } = useHR();

  // Selected Date
  const [selectedDate, setSelectedDate] = useState('2026-06-30');
  const [search, setSearch] = useState('');

  // Active employees
  const activeEmployees = useMemo(() => {
    return employees.filter((e) => e.status === 'Active');
  }, [employees]);

  // Current logs for the selected date
  const dateLogs = useMemo(() => {
    const logsMap = new Map<string, AttendanceType['status']>();
    attendance
      .filter((a) => a.date === selectedDate)
      .forEach((a) => logsMap.set(a.employeeId, a.status));
    return logsMap;
  }, [attendance, selectedDate]);

  // Draft state for logging attendance
  const [draftLogs, setDraftLogs] = useState<Record<string, AttendanceType['status']>>({});

  // Initialize draft logs when date changes
  React.useEffect(() => {
    const initialDraft: Record<string, AttendanceType['status']> = {};
    activeEmployees.forEach((emp) => {
      // Use existing log, otherwise default to 'Present'
      initialDraft[emp.id] = dateLogs.get(emp.id) || 'Present';
    });
    setDraftLogs(initialDraft);
  }, [activeEmployees, dateLogs, selectedDate]);

  // Change individual status
  const handleStatusChange = (employeeId: string, status: AttendanceType['status']) => {
    setDraftLogs((prev) => ({ ...prev, [employeeId]: status }));
  };

  // Mark all active as Present
  const handleMarkAllPresent = () => {
    const updated = { ...draftLogs };
    activeEmployees.forEach((emp) => {
      // Don't overwrite if they are On Leave
      if (updated[emp.id] !== 'On Leave') {
        updated[emp.id] = 'Present';
      }
    });
    setDraftLogs(updated);
  };

  // Save to context
  const handleSave = () => {
    const logsToSave = Object.keys(draftLogs).map((empId) => ({
      employeeId: empId,
      status: draftLogs[empId],
    }));
    logAttendance(selectedDate, logsToSave);
  };

  // Filtered employees for display
  const filteredEmployees = useMemo(() => {
    return activeEmployees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeEmployees, search]);

  // Calculations for Stats Card
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let onLeave = 0;

    activeEmployees.forEach((emp) => {
      const status = draftLogs[emp.id] || 'Present';
      if (status === 'Present') present++;
      else if (status === 'Late') late++;
      else if (status === 'Absent') absent++;
      else if (status === 'On Leave') onLeave++;
    });

    const total = activeEmployees.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { present, late, absent, onLeave, rate };
  }, [activeEmployees, draftLogs]);

  // Calculate historical attendance percentage per employee
  const historicalStats = useMemo(() => {
    const empStats: Record<string, { totalDays: number; presentDays: number }> = {};
    
    // Seed with all active employees
    activeEmployees.forEach((emp) => {
      empStats[emp.id] = { totalDays: 0, presentDays: 0 };
    });

    attendance.forEach((att) => {
      if (empStats[att.employeeId]) {
        empStats[att.employeeId].totalDays += 1;
        if (att.status === 'Present' || att.status === 'Late' || att.status === 'On Leave') {
          empStats[att.employeeId].presentDays += 1;
        }
      }
    });

    return empStats;
  }, [attendance, activeEmployees]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4! text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.rate}%</h3>
        </Card>
        <Card className="p-4! text-center border-l-4 border-l-emerald-500">
          <div className="flex justify-center text-emerald-500 mb-1"><CheckCircle size={16} /></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{stats.present}</h3>
        </Card>
        <Card className="p-4! text-center border-l-4 border-l-amber-500">
          <div className="flex justify-center text-amber-500 mb-1"><Clock size={16} /></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late</span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{stats.late}</h3>
        </Card>
        <Card className="p-4! text-center border-l-4 border-l-rose-500">
          <div className="flex justify-center text-rose-500 mb-1"><XCircle size={16} /></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{stats.absent}</h3>
        </Card>
        <Card className="p-4! text-center border-l-4 border-l-blue-500 col-span-2 lg:col-span-1">
          <div className="flex justify-center text-blue-500 mb-1"><AlertCircle size={16} /></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Leave</span>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{stats.onLeave}</h3>
        </Card>
      </div>

      {/* Settings Panel */}
      <Card className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Input
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-1.5! text-sm"
            />
          </div>
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleMarkAllPresent} className="flex-1 sm:flex-initial">
            Mark All Present
          </Button>
          <Button size="sm" onClick={handleSave} className="flex-1 sm:flex-initial">
            Save Log
          </Button>
        </div>
      </Card>

      {/* Attendance Logging Table */}
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20 dark:bg-slate-950/10">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Historical Rate</th>
              <th className="px-6 py-4">Today's Status</th>
              <th className="px-6 py-4 text-right">Logging Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
            {filteredEmployees.map((emp) => {
              const currentStatus = draftLogs[emp.id] || 'Present';
              const hist = historicalStats[emp.id];
              const histRate = hist && hist.totalDays > 0 ? Math.round((hist.presentDays / hist.totalDays) * 100) : 100;

              return (
                <tr key={emp.id} className="hover:bg-white/35 dark:hover:bg-slate-950/10 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</h5>
                      <span className="text-xs text-slate-400">{emp.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                    {emp.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full"
                          style={{ width: `${histRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{histRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        currentStatus === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : currentStatus === 'Late'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : currentStatus === 'Absent'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStatusChange(emp.id, 'Present')}
                        disabled={currentStatus === 'On Leave'}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(emp.id, 'Late')}
                        disabled={currentStatus === 'On Leave'}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'Late'
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(emp.id, 'Absent')}
                        disabled={currentStatus === 'On Leave'}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

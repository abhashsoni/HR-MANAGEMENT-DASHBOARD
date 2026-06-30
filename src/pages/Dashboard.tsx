import React, { useEffect, useState } from 'react';
import { useHR } from '../context/HRContext';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Users,
  CheckSquare,
  DollarSign,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { employees, attendance, leaves } = useHR();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for loading skeleton showcase
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 1. KPI calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;

  const today = '2026-06-30';
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 92;

  const monthlyPayroll = employees
    .filter((e) => e.status === 'Active')
    .reduce((sum, emp) => sum + emp.salary / 12, 0);

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  // 2. Chart Data: Department Distribution
  const deptCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });
  const departmentData = Object.keys(deptCounts).map((name) => ({
    name,
    value: deptCounts[name],
  }));

  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

  // 3. Chart Data: Monthly Attendance Rate (Simulated trends over last 6 months)
  const attendanceHistory = [
    { month: 'Jan', rate: 91 },
    { month: 'Feb', rate: 93 },
    { month: 'Mar', rate: 89 },
    { month: 'Apr', rate: 94 },
    { month: 'May', rate: 92 },
    { month: 'Jun', rate: attendanceRate },
  ];

  // 4. Chart Data: Payroll by Department
  const deptPayroll: Record<string, number> = {};
  employees.forEach((emp) => {
    if (emp.status === 'Active') {
      deptPayroll[emp.department] = (deptPayroll[emp.department] || 0) + Math.round(emp.salary / 12);
    }
  });
  const payrollData = Object.keys(deptPayroll).map((name) => ({
    department: name,
    amount: deptPayroll[name],
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-32 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <Skeleton variant="rectangular" width="40%" height={32} />
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 h-96 flex flex-col justify-between">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" width="100%" height="80%" />
          </Card>
          <Card className="h-96 flex flex-col justify-between">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="rectangular" width="100%" height="80%" />
          </Card>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      sub: `${activeEmployees} Active`,
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      sub: 'Logged today',
      icon: CheckSquare,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      trend: '+1.4%',
      trendUp: true,
    },
    {
      title: 'Monthly Payroll',
      value: `$${Math.round(monthlyPayroll).toLocaleString()}`,
      sub: 'Avg $8.5k / emp',
      icon: DollarSign,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      trend: '+4.2%',
      trendUp: true,
    },
    {
      title: 'Pending Leaves',
      value: pendingLeaves,
      sub: 'Needs approval',
      icon: FileText,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      trend: '-15%',
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} hoverable className="flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                    {kpi.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-2xl ${kpi.color}`}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <span className="text-xs text-slate-400 font-medium">{kpi.sub}</span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-bold ${
                    kpi.trendUp ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate Area Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Attendance Trends
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Average monthly attendance rate</p>
            </div>
            <div className="flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingUp size={14} />
              <span>Overall 92.5%</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution Pie Chart */}
        <Card className="flex flex-col">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">
            Department Distribution
          </h3>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalEmployees}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Employees
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Payroll by Department Bar Chart */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Payroll Distribution by Department
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly salary costs in USD ($)</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monthly Payroll']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {payrollData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

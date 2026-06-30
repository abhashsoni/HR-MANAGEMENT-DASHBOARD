import type { Employee, Attendance, LeaveRequest, PerformanceReview } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@hrflow.com',
    role: 'VP of Engineering',
    department: 'Engineering',
    salary: 135000,
    status: 'Active',
    joinDate: '2022-03-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    performanceScore: 5,
  },
  {
    id: 'EMP-002',
    name: 'Michael Chen',
    email: 'michael.c@hrflow.com',
    role: 'Lead Frontend Architect',
    department: 'Engineering',
    salary: 115000,
    status: 'Active',
    joinDate: '2023-01-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    performanceScore: 4,
  },
  {
    id: 'EMP-003',
    name: 'Elena Rostova',
    email: 'elena.r@hrflow.com',
    role: 'HR Director',
    department: 'Human Resources',
    salary: 95000,
    status: 'Active',
    joinDate: '2021-06-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    performanceScore: 5,
  },
  {
    id: 'EMP-004',
    name: 'Marcus Thompson',
    email: 'marcus.t@hrflow.com',
    role: 'Senior Product Designer',
    department: 'Design',
    salary: 105000,
    status: 'Active',
    joinDate: '2023-08-22',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    performanceScore: 4,
  },
  {
    id: 'EMP-005',
    name: 'Aisha Rahman',
    email: 'aisha.r@hrflow.com',
    role: 'Financial Analyst',
    department: 'Finance',
    salary: 88000,
    status: 'Active',
    joinDate: '2024-02-05',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    performanceScore: 3,
  },
  {
    id: 'EMP-006',
    name: 'David Kim',
    email: 'david.k@hrflow.com',
    role: 'Backend Engineer',
    department: 'Engineering',
    salary: 92000,
    status: 'Active',
    joinDate: '2024-05-15',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    performanceScore: 4,
  },
  {
    id: 'EMP-007',
    name: 'Sophia Martinez',
    email: 'sophia.m@hrflow.com',
    role: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    salary: 75000,
    status: 'Active',
    joinDate: '2024-09-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    performanceScore: 3,
  },
  {
    id: 'EMP-008',
    name: 'James Wilson',
    email: 'james.w@hrflow.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    salary: 110000,
    status: 'Active',
    joinDate: '2023-11-01',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    performanceScore: 4,
  },
  {
    id: 'EMP-009',
    name: 'Emma Watson',
    email: 'emma.w@hrflow.com',
    role: 'Marketing Lead',
    department: 'Marketing',
    salary: 82000,
    status: 'Active',
    joinDate: '2023-04-18',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    performanceScore: 3,
  },
  {
    id: 'EMP-010',
    name: 'Ryan Reynolds',
    email: 'ryan.r@hrflow.com',
    role: 'Content Strategist',
    department: 'Marketing',
    salary: 68000,
    status: 'Inactive',
    joinDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    performanceScore: 2,
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  // Attendance for June 29, 2026
  { id: 'att-1', date: '2026-06-29', employeeId: 'EMP-001', status: 'Present' },
  { id: 'att-2', date: '2026-06-29', employeeId: 'EMP-002', status: 'Present' },
  { id: 'att-3', date: '2026-06-29', employeeId: 'EMP-003', status: 'Present' },
  { id: 'att-4', date: '2026-06-29', employeeId: 'EMP-004', status: 'Late' },
  { id: 'att-5', date: '2026-06-29', employeeId: 'EMP-005', status: 'Present' },
  { id: 'att-6', date: '2026-06-29', employeeId: 'EMP-006', status: 'Absent' },
  { id: 'att-7', date: '2026-06-29', employeeId: 'EMP-007', status: 'Present' },
  { id: 'att-8', date: '2026-06-29', employeeId: 'EMP-008', status: 'On Leave' },
  { id: 'att-9', date: '2026-06-29', employeeId: 'EMP-009', status: 'Present' },

  // Attendance for June 30, 2026 (Today)
  { id: 'att-10', date: '2026-06-30', employeeId: 'EMP-001', status: 'Present' },
  { id: 'att-11', date: '2026-06-30', employeeId: 'EMP-002', status: 'Present' },
  { id: 'att-12', date: '2026-06-30', employeeId: 'EMP-003', status: 'Present' },
  { id: 'att-13', date: '2026-06-30', employeeId: 'EMP-004', status: 'Present' },
  { id: 'att-14', date: '2026-06-30', employeeId: 'EMP-005', status: 'Late' },
  { id: 'att-15', date: '2026-06-30', employeeId: 'EMP-006', status: 'Present' },
  { id: 'att-16', date: '2026-06-30', employeeId: 'EMP-007', status: 'Present' },
  { id: 'att-17', date: '2026-06-30', employeeId: 'EMP-008', status: 'On Leave' },
  { id: 'att-18', date: '2026-06-30', employeeId: 'EMP-009', status: 'Present' },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-101',
    employeeId: 'EMP-008',
    employeeName: 'James Wilson',
    leaveType: 'Annual',
    startDate: '2026-06-28',
    endDate: '2026-07-02',
    status: 'Approved',
    reason: 'Family summer vacation trip.'
  },
  {
    id: 'LR-102',
    employeeId: 'EMP-005',
    employeeName: 'Aisha Rahman',
    leaveType: 'Sick',
    startDate: '2026-07-02',
    endDate: '2026-07-03',
    status: 'Pending',
    reason: 'Dental appointment and recovery.'
  },
  {
    id: 'LR-103',
    employeeId: 'EMP-002',
    employeeName: 'Michael Chen',
    leaveType: 'Casual',
    startDate: '2026-07-06',
    endDate: '2026-07-07',
    status: 'Pending',
    reason: 'Moving to a new apartment.'
  },
  {
    id: 'LR-104',
    employeeId: 'EMP-004',
    employeeName: 'Marcus Thompson',
    leaveType: 'Annual',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    status: 'Approved',
    reason: 'Personal errands.'
  },
  {
    id: 'LR-105',
    employeeId: 'EMP-009',
    employeeName: 'Emma Watson',
    leaveType: 'Unpaid',
    startDate: '2026-06-15',
    endDate: '2026-06-15',
    status: 'Rejected',
    reason: 'Urgent marketing campaign launch scheduled.'
  }
];

export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'PR-201',
    employeeId: 'EMP-001',
    employeeName: 'Sarah Jenkins',
    reviewerName: 'Board of Directors',
    rating: 5,
    feedback: 'Outstanding leadership of the engineering org. Successfully scaled the platform architecture and hit all Q2 product delivery milestones.',
    date: '2026-06-15',
    goals: [
      { id: 'g-1', description: 'Scale engineering team by 25%', status: 'In Progress' },
      { id: 'g-2', description: 'Reduce cloud infrastructure costs by 15%', status: 'Completed' },
      { id: 'g-3', description: 'Migrate legacy microservices to modern serverless stack', status: 'In Progress' }
    ]
  },
  {
    id: 'PR-202',
    employeeId: 'EMP-002',
    employeeName: 'Michael Chen',
    reviewerName: 'Sarah Jenkins',
    rating: 4,
    feedback: 'Excellent work leading the frontend rewrite. Code quality is high and system performance improved significantly. Focus next on mentoring junior devs.',
    date: '2026-06-18',
    goals: [
      { id: 'g-4', description: 'Introduce Tailwind v4 and clean up utility bloat', status: 'Completed' },
      { id: 'g-5', description: 'Conduct weekly frontend mentoring sessions', status: 'In Progress' },
      { id: 'g-6', description: 'Optimize Core Web Vitals to hit green LCP score', status: 'In Progress' }
    ]
  },
  {
    id: 'PR-203',
    employeeId: 'EMP-005',
    employeeName: 'Aisha Rahman',
    reviewerName: 'Elena Rostova',
    rating: 3,
    feedback: 'Steady performance in financial auditing. Detail-oriented but needs to speed up report generation processes.',
    date: '2026-06-20',
    goals: [
      { id: 'g-7', description: 'Automate weekly budget consolidation', status: 'Pending' },
      { id: 'g-8', description: 'Complete advanced Excel and SQL training', status: 'Completed' }
    ]
  }
];

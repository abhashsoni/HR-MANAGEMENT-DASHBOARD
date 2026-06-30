export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar: string;
  performanceScore: number;
}

export interface Attendance {
  id: string;
  date: string; // YYYY-MM-DD
  employeeId: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick' | 'Annual' | 'Casual' | 'Unpaid';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface Goal {
  id: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerName: string;
  rating: number; // 1 to 5
  feedback: string;
  date: string; // YYYY-MM-DD
  goals: Goal[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

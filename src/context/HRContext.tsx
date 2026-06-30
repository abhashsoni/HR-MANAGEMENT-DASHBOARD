import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee, Attendance, LeaveRequest, PerformanceReview, Goal } from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PERFORMANCE_REVIEWS,
} from '../utils/mockData';
import { useToast } from './ToastContext';

interface HRContextType {
  employees: Employee[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
  performance: PerformanceReview[];
  addEmployee: (employee: Omit<Employee, 'id' | 'performanceScore'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  logAttendance: (date: string, logs: { employeeId: string; status: Attendance['status'] }[]) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  addPerformanceReview: (review: Omit<PerformanceReview, 'id' | 'date'>) => void;
  updateGoalStatus: (reviewId: string, goalId: string, status: Goal['status']) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Helper to load from localStorage or fallback
  const getStoredData = <T,>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}"`, e);
      }
    }
    return fallback;
  };

  const [employees, setEmployees] = useState<Employee[]>(() =>
    getStoredData('hr_employees', INITIAL_EMPLOYEES)
  );
  const [attendance, setAttendance] = useState<Attendance[]>(() =>
    getStoredData('hr_attendance', INITIAL_ATTENDANCE)
  );
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    getStoredData('hr_leaves', INITIAL_LEAVE_REQUESTS)
  );
  const [performance, setPerformance] = useState<PerformanceReview[]>(() =>
    getStoredData('hr_performance', INITIAL_PERFORMANCE_REVIEWS)
  );

  // Sync to localStorage on changes
  useEffect(() => {
    localStorage.setItem('hr_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hr_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('hr_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('hr_performance', JSON.stringify(performance));
  }, [performance]);

  // Employee CRUD
  const addEmployee = (newEmp: Omit<Employee, 'id' | 'performanceScore'>) => {
    const nextId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const employee: Employee = {
      ...newEmp,
      id: nextId,
      performanceScore: 3, // Default average score
    };
    setEmployees((prev) => [...prev, employee]);
    showToast('Employee Added', `${employee.name} has been added successfully.`, 'success');
  };

  const updateEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
    );
    showToast('Employee Updated', `${updatedEmp.name}'s details have been updated.`, 'success');
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    showToast('Employee Deleted', `${emp?.name || 'Employee'} has been removed.`, 'warning');
  };

  // Attendance logging
  const logAttendance = (date: string, logs: { employeeId: string; status: Attendance['status'] }[]) => {
    setAttendance((prev) => {
      // Remove existing logs for this date
      const filtered = prev.filter((att) => att.date !== date);
      const newLogs: Attendance[] = logs.map((log, index) => ({
        id: `att-${date}-${index}-${Math.random().toString(36).substring(2, 5)}`,
        date,
        employeeId: log.employeeId,
        status: log.status,
      }));
      return [...filtered, ...newLogs];
    });
    showToast('Attendance Saved', `Attendance for ${date} has been logged.`, 'success');
  };

  // Leave Management
  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status'>) => {
    const id = `LR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newRequest: LeaveRequest = {
      ...req,
      id,
      status: 'Pending',
    };
    setLeaves((prev) => [newRequest, ...prev]);
    showToast('Leave Requested', `Leave request submitted for ${req.employeeName}.`, 'info');
  };

  const updateLeaveStatus = (id: string, status: LeaveRequest['status']) => {
    setLeaves((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          // If approved, log attendance status as "On Leave" for those dates
          if (status === 'Approved') {
            // Log attendance for each day in the range
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const newAtts: Attendance[] = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              newAtts.push({
                id: `att-${dateStr}-${req.employeeId}`,
                date: dateStr,
                employeeId: req.employeeId,
                status: 'On Leave',
              });
            }
            setAttendance((prevAtt) => {
              const idsToRemove = newSetOfAttendanceIds(newAtts);
              return [
                ...prevAtt.filter((a) => !idsToRemove.has(`${a.date}-${a.employeeId}`)),
                ...newAtts,
              ];
            });
          }
          return { ...req, status };
        }
        return req;
      })
    );
    showToast(`Leave ${status}`, `Leave request ${id} has been ${status.toLowerCase()}.`, status === 'Approved' ? 'success' : 'error');
  };

  const newSetOfAttendanceIds = (newAtts: Attendance[]) => {
    const s = new Set<string>();
    newAtts.forEach((a) => s.add(`${a.date}-${a.employeeId}`));
    return s;
  };

  // Performance reviews
  const addPerformanceReview = (review: Omit<PerformanceReview, 'id' | 'date'>) => {
    const id = `PR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const date = new Date().toISOString().split('T')[0];
    const newReview: PerformanceReview = {
      ...review,
      id,
      date,
    };
    setPerformance((prev) => [newReview, ...prev]);

    // Update employee's overall performance score
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === review.employeeId) {
          return { ...emp, performanceScore: review.rating };
        }
        return emp;
      })
    );

    showToast('Review Added', `Performance review for ${review.employeeName} submitted.`, 'success');
  };

  const updateGoalStatus = (reviewId: string, goalId: string, status: Goal['status']) => {
    setPerformance((prev) =>
      prev.map((rev) => {
        if (rev.id === reviewId) {
          const updatedGoals = rev.goals.map((g) => (g.id === goalId ? { ...g, status } : g));
          return { ...rev, goals: updatedGoals };
        }
        return rev;
      })
    );
    showToast('Goal Updated', 'Performance goal status has been updated.', 'info');
  };

  return (
    <HRContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        performance,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        logAttendance,
        addLeaveRequest,
        updateLeaveStatus,
        addPerformanceReview,
        updateGoalStatus,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};

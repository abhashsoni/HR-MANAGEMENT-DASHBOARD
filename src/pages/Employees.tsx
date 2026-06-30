import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import type { Employee } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import {
  Search,
  Plus,
  Grid,
  List,
  Edit2,
  Trash2,
  Mail,
  Star,
} from 'lucide-react';

export const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHR();

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    salary: 60000,
    status: 'Active' as Employee['status'],
    joinDate: new Date().toISOString().split('T')[0],
    avatar: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Departments list for filter
  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department));
    return ['All', ...Array.from(depts)];
  }, [employees]);

  // Filter & Search Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, search, selectedDept, selectedStatus]);

  // Pagination Logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      salary: 60000,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      salary: emp.salary,
      status: emp.status,
      joinDate: emp.joinDate,
      avatar: emp.avatar,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.role.trim()) errors.role = 'Role is required';
    if (formData.salary <= 0) errors.salary = 'Salary must be greater than 0';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Default Avatar if not provided
    const avatarUrl = formData.avatar.trim() || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`;

    if (editingEmployee) {
      updateEmployee({
        ...editingEmployee,
        ...formData,
        avatar: avatarUrl,
      });
    } else {
      addEmployee({
        ...formData,
        avatar: avatarUrl,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Controls: Search, Filter & Actions */}
      <Card className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row flex-1 gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role or ID..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm"
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              options={departments.map((d) => ({ value: d, label: d }))}
              value={selectedDept}
              onChange={handleDeptChange}
              className="py-2! text-sm"
            />
          </div>
          <div className="w-full sm:w-36">
            <Select
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={selectedStatus}
              onChange={handleStatusChange}
              className="py-2! text-sm"
            />
          </div>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white/40 dark:bg-slate-900/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <List size={16} />
            </button>
          </div>
          <Button onClick={handleOpenAddModal} icon={<Plus size={16} />}>
            Add Employee
          </Button>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedEmployees.map((emp) => (
            <Card key={emp.id} hoverable className="flex flex-col justify-between text-center relative pt-8">
              {/* Status Badge */}
              <span
                className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  emp.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                {emp.status}
              </span>

              <div>
                {/* Avatar */}
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-purple-500/10 shadow-md mb-4"
                />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                  {emp.name}
                </h4>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                  {emp.role}
                </p>
                <p className="text-xs text-slate-400 mt-1">{emp.department}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{emp.id}</p>

                {/* Rating */}
                <div className="flex justify-center gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < emp.performanceScore
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Footer details & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Salary
                  </span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ${(emp.salary / 1000).toFixed(0)}k/yr
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(emp)}
                    className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                    title="Edit Details"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-all cursor-pointer"
                    title="Delete Employee"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20 dark:bg-slate-950/10">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Salary</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/35 dark:hover:bg-slate-950/10 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</h5>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={12} /> {emp.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                    {emp.id}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {emp.department}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {emp.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        emp.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                    ${emp.salary.toLocaleString()}/yr
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {emp.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(emp)}
                        className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-all cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-slate-400 font-semibold text-base">No employees found matching filters.</p>
        </Card>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john.doe@hrflow.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Role / Title"
              placeholder="e.g. Frontend Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              error={formErrors.role}
            />
            <Select
              label="Department"
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Design', label: 'Design' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Marketing', label: 'Marketing' },
              ]}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Annual Salary ($)"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              error={formErrors.salary}
            />
            <Select
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Join Date"
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            />
            <Input
              label="Avatar Image URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingEmployee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { staffApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const StaffManagement = () => {
  const { showNotification } = useNotification();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Billing Manager',
    department: 'Finance'
  });

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffApi.getAll();
      setStaffList(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Staff',
        message: 'Could not fetch authorized staff members.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Billing Manager',
      department: 'Finance'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and email are required.'
      });
      return;
    }

    try {
      await staffApi.create({
        ...formData,
        permissions: ['billing_management', 'invoice_generation']
      });
      showNotification({
        type: 'success',
        title: 'Invitation Dispatched',
        message: `${formData.name} was added with role ${formData.role}.`
      });
      setIsModalOpen(false);
      loadStaff();
    } catch {
      showNotification({
        type: 'error',
        title: 'Add Failed',
        message: 'Unable to register staff member.'
      });
    }
  };

  const columns = [
    {
      header: 'Staff Member',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={val}
            className="w-8 h-8 rounded-full object-cover border border-[#EAECEF]"
          />
          <div>
            <span className="font-semibold text-[#172033] block">{val}</span>
            <span className="text-[11px] text-[#64748B]">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Role',
      field: 'role',
      sortable: true,
      render: (val) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF1C2] text-amber-900 border border-amber-300">
          {val}
        </span>
      )
    },
    {
      header: 'Department',
      field: 'department',
      sortable: true,
      render: (val) => <span className="text-[#172033] font-medium">{val}</span>
    },
    {
      header: 'Last Active',
      field: 'lastActive',
      sortable: true,
      render: (val) => <span className="text-slate-500 text-[11px]">{val}</span>
    },
    {
      header: 'Status',
      field: 'status',
      sortable: true,
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      header: 'Permission Flags',
      key: 'perms',
      render: (_, row) => (
        <div className="flex items-center gap-1 flex-wrap max-w-xs">
          {(row.permissions || []).slice(0, 2).map((p) => (
            <span
              key={p}
              className="text-[10px] px-1.5 py-0.5 bg-[#FFFDF7] border border-[#EAECEF] rounded text-slate-600 font-mono"
            >
              {p}
            </span>
          ))}
          {(row.permissions || []).length > 2 && (
            <span className="text-[10px] text-slate-400">
              +{row.permissions.length - 2} more
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Staff & Access Management
          </h2>
          <p className="text-xs text-[#64748B]">
            Assign administrative permissions, financial auditor access, and support privileges
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={handleOpenAdd}
        >
          Add Staff Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={staffList}
        isLoading={loading}
        searchPlaceholder="Search staff by name or email..."
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Staff Member"
        description="Assign administrative roles and department scope."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Sophia Chen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Work Email Address"
            type="email"
            placeholder="sophia.c@brightloop.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                'Super Admin',
                'Billing Manager',
                'Support Agent',
                'Financial Auditor'
              ]}
              required
            />

            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                'Finance & Accounting',
                'Customer Success',
                'Engineering & Operations',
                'Compliance'
              ]}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagement;

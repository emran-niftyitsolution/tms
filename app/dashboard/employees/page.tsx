"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Staff = {
  _id: string;
  name: string;
  role: "Driver" | "Helper" | "Supervisor" | "Guide";
  contactNumber: string;
  licenseNumber?: string;
  nid?: string;
  company: { _id: string; name: string } | null;
  status: "Active" | "Inactive" | "OnLeave";
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const [staffRes, companiesRes] = await Promise.all([
        fetch("/api/staff"),
        fetch("/api/companies"),
      ]);

      if (staffRes.ok) {
        const data = await staffRes.json();
        setStaff(Array.isArray(data) ? data : []);
      }

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(
          Array.isArray(data)
            ? data.map((c: any) => ({ label: c.name, value: c._id }))
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let filtered = staff;

    if (searchText) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.contactNumber.includes(searchText) ||
          emp.licenseNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.nid?.includes(searchText)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((emp) => emp.role === roleFilter);
    }

    if (companyFilter) {
      filtered = filtered.filter(
        (emp) => emp.company?._id === companyFilter
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    setFilteredStaff(filtered);
  }, [staff, searchText, roleFilter, companyFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete staff");
      }

      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to delete staff");
    }
  };

  const roleColors: Record<string, string> = {
    Driver: "blue",
    Helper: "cyan",
    Supervisor: "purple",
    Guide: "geekblue",
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Staff) => (
        <Link
          href={`/dashboard/employees/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={roleColors[role] || "default"}>{role}</Tag>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
      render: (license: string) => license || "-",
    },
    {
      title: "NID",
      dataIndex: "nid",
      key: "nid",
      render: (nid: string) => nid || "-",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Staff["company"]) => company?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Staff["status"]) => {
        const colorMap: Record<string, string> = {
          Active: "success",
          Inactive: "default",
          OnLeave: "warning",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Staff) => (
        <Space size="middle">
          <Link href={`/dashboard/employees/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the staff"
            description="Are you sure to delete this staff?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              title="Delete"
            >
              <FiTrash2 className="h-4 w-4 text-white" />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Staff
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage all staff members (Drivers, Helpers, Supervisors, etc.)
          </p>
        </div>
        <Link href="/dashboard/employees/new">
          <Button
            type="primary"
            icon={<FiPlus />}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
              height: 40,
              borderRadius: 8,
              fontWeight: 600,
              paddingInline: 24,
            }}
          >
            Add Staff
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          placeholder="Search by name, contact, license, or NID"
          prefix={<FiSearch className="text-slate-400 dark:text-slate-300" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
          allowClear
        />
          <Select
          placeholder="Filter by Role"
          value={roleFilter}
          onChange={setRoleFilter}
          allowClear
          className="min-w-[150px]"
          options={[
            { label: "Driver", value: "Driver" },
            { label: "Helper", value: "Helper" },
            { label: "Supervisor", value: "Supervisor" },
            { label: "Guide", value: "Guide" },
          ]}
        />
        <Select
          placeholder="Filter by Company"
          value={companyFilter}
          onChange={setCompanyFilter}
          allowClear
          className="min-w-[150px]"
          options={companies}
          showSearch
          optionFilterProp="label"
        />
        <Select
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
          className="min-w-[150px]"
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
            { label: "On Leave", value: "OnLeave" },
          ]}
        />
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <Table
          columns={columns}
          dataSource={filteredStaff}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} staff`,
          }}
        />
      </div>
    </div>
  );
}


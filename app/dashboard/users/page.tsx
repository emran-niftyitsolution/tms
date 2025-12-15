"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Operator" | "User";
  permissions: string[];
  company?: { _id: string; name: string } | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>(
    []
  );

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, companiesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/companies"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        const userList = Array.isArray(data) ? data : [];
        setUsers(userList);
        setFilteredUsers(userList);
      }

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(
          Array.isArray(data)
            ? data.map((c: any) => ({ label: c.name, value: c.name })) // Using name for filtering for simplicity in this view
            : []
        );
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerSearch) ||
          u.email.toLowerCase().includes(lowerSearch)
      );
    }

    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (companyFilter) {
      result = result.filter((u) => u.company?.name === companyFilter);
    }

    setFilteredUsers(result);
  }, [users, searchText, roleFilter, companyFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <Link
          href={`/dashboard/users/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: User["role"]) => {
        const colors: Record<User["role"], string> = {
          Admin: "red",
          Operator: "blue",
          User: "green",
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      },
    },
    {
        title: "Company",
        dataIndex: "company",
        key: "company",
        render: (company: User["company"]) => company?.name || "-",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(permissions || []).map((perm) => (
            <Tag key={perm} className="text-xs border-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {perm}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          <Link href={`/dashboard/users/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
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
            Users
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage system users and their permissions
          </p>
        </div>
        <Link href="/dashboard/users/new">
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
            Add User
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400 dark:text-slate-300" />}
          placeholder="Search users..."
          className="rounded-lg"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Role"
          allowClear
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(value) => setRoleFilter(value)}
          options={[
            { label: "Admin", value: "Admin" },
            { label: "Operator", value: "Operator" },
            { label: "User", value: "User" },
          ]}
        />
        <Select
          placeholder="Company"
          allowClear
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(value) => setCompanyFilter(value)}
          options={companies}
          showSearch
          optionFilterProp="label"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

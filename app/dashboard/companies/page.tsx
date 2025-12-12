"use client";

import { Button, Popconfirm, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Company = {
  _id: string;
  name: string;
  type: "Bus" | "Train" | "Air" | "Ship";
  routes: number;
  status: "Active" | "Inactive";
  contact: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/companies");
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete company");
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Company) => (
        <Link
          href={`/dashboard/companies/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: Company["type"]) => {
        const colors: Record<Company["type"], string> = {
          Bus: "green",
          Train: "blue",
          Air: "purple",
          Ship: "orange",
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      },
    },
    {
      title: "Routes",
      dataIndex: "routes",
      key: "routes",
    },
    {
      title: "Contact",
      dataIndex: "email", // Changed to show email or phone if available
      key: "contact",
      render: (text: string, record: any) =>
        record.email || record.phone || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Company["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Company) => (
        <Space size="middle">
          <Link href={`/dashboard/companies/${record._id}`}>
            <Button type="text" icon={<FiEdit2 />} />
          </Link>
          <Popconfirm
            title="Delete the company"
            description="Are you sure to delete this company?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<FiTrash2 />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Companies
          </h2>
          <p className="text-sm text-slate-500">
            Manage transport operators and partners
          </p>
        </div>
        <Link href="/dashboard/companies/new">
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
            Add Company
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={companies}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

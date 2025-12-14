"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Bus = {
  _id: string;
  number: string;
  brand?: string;
  model?: string;
  type: "AC" | "Non-AC" | "Sleeper" | "Seater" | "Double Decker";
  capacity: number;
  company: { _id: string; name: string } | null;
  status: "Active" | "Maintenance" | "Inactive";
};

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const [busesRes, companiesRes] = await Promise.all([
        fetch("/api/buses"),
        fetch("/api/companies"),
      ]);

      if (busesRes.ok) {
        const data = await busesRes.json();
        const busList = Array.isArray(data) ? data : [];
        setBuses(busList);
        setFilteredBuses(busList);
      }

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(
          Array.isArray(data)
            ? data.map((c: any) => ({ label: c.name, value: c._id }))
            : []
        );
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    let result = buses;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (b) =>
          b.number.toLowerCase().includes(lowerSearch) ||
          b.brand?.toLowerCase().includes(lowerSearch) ||
          b.model?.toLowerCase().includes(lowerSearch)
      );
    }

    if (typeFilter) {
      result = result.filter((b) => b.type === typeFilter);
    }

    if (companyFilter) {
      result = result.filter((b) => b.company?._id === companyFilter);
    }

    if (statusFilter) {
      result = result.filter((b) => b.status === statusFilter);
    }

    setFilteredBuses(result);
  }, [buses, searchText, typeFilter, companyFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/buses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete bus");
      toast.success("Bus deleted successfully");
      fetchBuses();
    } catch {
      toast.error("Failed to delete bus");
    }
  };

  const columns = [
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "number",
      render: (text: string, record: Bus) => (
        <Link
          href={`/dashboard/buses/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Brand/Model",
      key: "brandModel",
      render: (_: unknown, record: Bus) => (
        <div>
          {record.brand && record.model ? (
            <span>{record.brand} {record.model}</span>
          ) : record.brand ? (
            <span>{record.brand}</span>
          ) : record.model ? (
            <span>{record.model}</span>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (cap: number) => <span className="font-medium">{cap} seats</span>,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Bus["company"]) => company?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Bus["status"]) => {
        const colorMap: Record<string, string> = {
          Active: "success",
          Maintenance: "warning",
          Inactive: "default",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Bus) => (
        <Space size="middle">
          <Link href={`/dashboard/buses/${record._id}`}>
            <Button type="text" icon={<FiEdit2 />} />
          </Link>
          <Popconfirm
            title="Delete the bus"
            description="Are you sure to delete this bus?"
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Buses
          </h2>
          <p className="text-sm text-slate-500">
            Manage your bus fleet
          </p>
        </div>
        <Link href="/dashboard/buses/new">
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
            Add Bus
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400" />}
          placeholder="Search buses..."
          className="rounded-lg"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Type"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setTypeFilter(value)}
          options={[
            { label: "AC", value: "AC" },
            { label: "Non-AC", value: "Non-AC" },
            { label: "Sleeper", value: "Sleeper" },
            { label: "Seater", value: "Seater" },
            { label: "Double Decker", value: "Double Decker" },
          ]}
        />
        <Select
          placeholder="Company"
          allowClear
          className="rounded-lg"
          style={{ width: 160 }}
          onChange={(value) => setCompanyFilter(value)}
          options={companies}
          showSearch
          optionFilterProp="label"
        />
        <Select
          placeholder="Status"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { label: "Active", value: "Active" },
            { label: "Maintenance", value: "Maintenance" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredBuses}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

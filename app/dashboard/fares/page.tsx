"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Fare = {
  _id: string;
  company: { _id: string; name: string } | null;
  seatClass: { _id: string; name: string; fare: number } | null;
  route: {
    _id: string;
    name: string;
    from: { _id: string; name: string } | string;
    to: { _id: string; name: string } | string;
  } | null;
  fare: number;
  status: "Active" | "Inactive";
};

export default function FaresPage() {
  const [fares, setFares] = useState<Fare[]>([]);
  const [filteredFares, setFilteredFares] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

  const fetchFares = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fares");
      if (res.ok) {
        const data = await res.json();
        const fareList = Array.isArray(data) ? data : [];
        setFares(fareList);
        setFilteredFares(fareList);
      }
    } catch {
      toast.error("Failed to load fares");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFares();
    // Fetch companies for filter
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompanies(
            data.map((c: any) => ({ label: c.name, value: c._id }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let result = fares;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((fare) => {
        const routeName = fare.route?.name || "";
        const seatClassName = fare.seatClass?.name || "";
        return (
          routeName.toLowerCase().includes(lowerSearch) ||
          seatClassName.toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (statusFilter) {
      result = result.filter((fare) => fare.status === statusFilter);
    }

    if (companyFilter) {
      result = result.filter(
        (fare) => fare.company?._id === companyFilter
      );
    }

    setFilteredFares(result);
  }, [fares, searchText, statusFilter, companyFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/fares/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete fare");
      toast.success("Fare deleted successfully");
      fetchFares();
    } catch {
      toast.error("Failed to delete fare");
    }
  };

  const columns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (route: Fare["route"]) => {
        if (!route) return "-";
        const from = typeof route.from === "object" ? route.from.name : route.from;
        const to = typeof route.to === "object" ? route.to.name : route.to;
        return (
          <Link
            href={`/dashboard/routes/${route._id}`}
            className="font-medium text-slate-900 dark:text-white hover:text-indigo-600"
          >
            {route.name}
          </Link>
        );
      },
    },
    {
      title: "From - To",
      key: "fromTo",
      render: (_: unknown, record: Fare) => {
        if (!record.route) return "-";
        const from = typeof record.route.from === "object" ? record.route.from.name : record.route.from;
        const to = typeof record.route.to === "object" ? record.route.to.name : record.route.to;
        return (
          <span className="text-slate-600 dark:text-slate-400">
            {from} - {to}
          </span>
        );
      },
    },
    {
      title: "Seat Class",
      dataIndex: "seatClass",
      key: "seatClass",
      render: (seatClass: Fare["seatClass"]) => {
        if (!seatClass) return "-";
        return (
          <Link
            href={`/dashboard/seat-classes/${seatClass._id}`}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            {seatClass.name}
          </Link>
        );
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Fare["company"]) => company?.name || "-",
    },
    {
      title: "Fare (৳)",
      dataIndex: "fare",
      key: "fare",
      render: (fare: number) => (
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          ৳{fare?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Base Class Fare",
      dataIndex: "seatClass",
      key: "baseFare",
      render: (seatClass: Fare["seatClass"]) => (
        <span className="text-slate-600 dark:text-slate-400">
          ৳{seatClass?.fare?.toLocaleString() || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Fare["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Fare) => (
        <Space size="middle">
          <Link href={`/dashboard/fares/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-500 p-2 text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-white" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the fare"
            description="Are you sure to delete this fare?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-800"
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
            Fares
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage fare configurations for routes and seat classes
          </p>
        </div>
        <Link href="/dashboard/fares/new">
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
            Create Fare
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400" />}
          placeholder="Search routes or seat classes..."
          className="rounded-lg"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by Company"
          allowClear
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(value) => setCompanyFilter(value)}
          options={companies}
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredFares}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

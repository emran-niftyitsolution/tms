"use client";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

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

  const handleEdit = (record: Company) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

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

  const handleFinish = async (values: any) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/companies/${editingId}` : "/api/companies";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save company");

      toast.success(
        editingId
          ? "Company updated successfully"
          : "Company created successfully"
      );
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchCompanies();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
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
      dataIndex: "contact",
      key: "contact",
      render: (text: string) => text || "-",
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
          <Button
            type="text"
            icon={<FiEdit2 />}
            onClick={() => handleEdit(record)}
          />
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
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Companies
          </h2>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Manage transport operators and partners
          </p>
        </div>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsModalOpen(true)}
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
      </div>

      <Table
        columns={columns}
        dataSource={companies}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingId ? "Edit Company" : "Add Company"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ status: "Active", routes: 0 }}
        >
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="e.g. Green Line Paribahan" />
          </Form.Item>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="type"
              label="Transport Type"
              rules={[{ required: true, message: "Please select type" }]}
            >
              <Select placeholder="Select Type">
                <Select.Option value="Bus">Bus</Select.Option>
                <Select.Option value="Train">Train</Select.Option>
                <Select.Option value="Air">Air</Select.Option>
                <Select.Option value="Ship">Ship</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}
          >
            <Form.Item name="routes" label="No. of Routes">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="contact" label="Contact Info (Optional)">
              <Input placeholder="Phone or Email" />
            </Form.Item>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

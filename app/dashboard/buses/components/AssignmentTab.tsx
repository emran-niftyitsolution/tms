"use client";

import { Button, Table, Tag, Modal, Form, Select, DatePicker } from "antd";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import dayjs from "dayjs";

interface AssignmentTabProps {
  assignments: any[];
  staff: any[];
  routes: any[];
  onAdd: (values: any) => Promise<void>;
}

export function AssignmentTab({ assignments, staff, routes, onAdd }: AssignmentTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    await onAdd(values);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: "Driver", dataIndex: ["driver", "name"], key: "driver" },
    { title: "Helper", dataIndex: ["helper", "name"], key: "helper", render: (h: any) => h || "-" },
    { title: "Route", dataIndex: ["route", "name"], key: "route", render: (r: any) => r || "-" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate", render: (d: string) => dayjs(d).format("MMM D, YYYY") },
    { title: "End Date", dataIndex: "endDate", key: "endDate", render: (d: string) => d ? dayjs(d).format("MMM D, YYYY") : "Ongoing" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Active" ? "success" : "default"}>{s}</Tag> },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Driver & Crew Assignments</h3>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalOpen(true)}>New Assignment</Button>
      </div>
      <Table columns={columns} dataSource={assignments} rowKey="_id" pagination={{ pageSize: 10 }} />

      <Modal title="New Assignment" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={600} style={{ top: 20 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="driver" label="Driver" rules={[{ required: true }]}>
            <Select options={staff.filter(s => s.role === "Driver").map(s => ({ label: s.name, value: s._id }))} />
          </Form.Item>
          <Form.Item name="helper" label="Helper">
            <Select options={staff.filter(s => s.role === "Helper").map(s => ({ label: s.name, value: s._id }))} />
          </Form.Item>
          <Form.Item name="route" label="Route">
            <Select options={routes} />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}



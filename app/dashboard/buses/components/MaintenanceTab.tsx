"use client";

import { Button, Table, Tag, Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import dayjs from "dayjs";

interface MaintenanceTabProps {
  maintenance: any[];
  onAdd: (values: any) => Promise<void>;
}

export function MaintenanceTab({ maintenance, onAdd }: MaintenanceTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    await onAdd(values);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag>{t}</Tag> },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Cost", dataIndex: "cost", key: "cost", render: (c: number) => `৳${c?.toLocaleString()}` },
    { title: "Service Date", dataIndex: "serviceDate", key: "serviceDate", render: (d: string) => dayjs(d).format("MMM D, YYYY") },
    { title: "Next Service", dataIndex: "nextServiceDate", key: "nextServiceDate", render: (d: string) => d ? dayjs(d).format("MMM D, YYYY") : "-" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Completed" ? "success" : s === "InProgress" ? "processing" : "default"}>{s}</Tag> },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Maintenance History</h3>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalOpen(true)}>Add Maintenance</Button>
      </div>
      <Table columns={columns} dataSource={maintenance} rowKey="_id" pagination={{ pageSize: 10 }} />

      <Modal title="Add Maintenance Record" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={600} style={{ top: 20 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={[
              { label: "Routine", value: "Routine" },
              { label: "Repair", value: "Repair" },
              { label: "Inspection", value: "Inspection" },
              { label: "Emergency", value: "Emergency" },
              { label: "Upgrade", value: "Upgrade" },
            ]} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="cost" label="Cost" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="serviceDate" label="Service Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="nextServiceDate" label="Next Service Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="serviceProvider" label="Service Provider">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Scheduled">
            <Select options={[
              { label: "Scheduled", value: "Scheduled" },
              { label: "InProgress", value: "InProgress" },
              { label: "Completed", value: "Completed" },
            ]} />
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


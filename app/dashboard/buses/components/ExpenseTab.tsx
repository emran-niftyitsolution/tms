"use client";

import { Button, Table, Tag, Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import dayjs from "dayjs";

interface ExpenseTabProps {
  expenses: any[];
  onAdd: (values: any) => Promise<void>;
}

export function ExpenseTab({ expenses, onAdd }: ExpenseTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    await onAdd(values);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag>{t}</Tag> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (a: number) => `৳${a?.toLocaleString()}` },
    { title: "Date", dataIndex: "date", key: "date", render: (d: string) => dayjs(d).format("MMM D, YYYY") },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Receipt", dataIndex: "receiptNumber", key: "receiptNumber", render: (r: string) => r || "-" },
  ];

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Expense Tracking</h3>
          <p className="text-sm text-slate-500 mt-1">Total: ৳{totalExpenses.toLocaleString()}</p>
        </div>
        <Button type="primary" icon={<FiPlus />} onClick={() => setModalOpen(true)}>Add Expense</Button>
      </div>
      <Table columns={columns} dataSource={expenses} rowKey="_id" pagination={{ pageSize: 10 }} />

      <Modal title="Add Expense" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={600} style={{ top: 20 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={[
              { label: "Fuel", value: "Fuel" },
              { label: "Toll", value: "Toll" },
              { label: "Parking", value: "Parking" },
              { label: "Cleaning", value: "Cleaning" },
              { label: "Other", value: "Other" },
            ]} />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]} initialValue={dayjs()}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="receiptNumber" label="Receipt Number">
            <Input />
          </Form.Item>
          <Form.Item name="odometerReading" label="Odometer Reading">
            <InputNumber min={0} style={{ width: "100%" }} />
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


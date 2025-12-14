"use client";

import { Tag } from "antd";
import { FiAlertCircle } from "react-icons/fi";
import dayjs from "dayjs";

type BusStatus = "Active" | "Maintenance" | "Inactive";

interface StatusBadgeProps {
  status: BusStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = false }: StatusBadgeProps) {
  const config = {
    Active: { color: "success", label: "Active" },
    Maintenance: { color: "warning", label: "Maintenance" },
    Inactive: { color: "default", label: "Inactive" },
  };

  const { color, label } = config[status];
  return <Tag color={color}>{showIcon && <FiAlertCircle className="mr-1" />}{label}</Tag>;
}

interface DocumentExpiryAlertProps {
  fitnessExpiry?: string;
  insuranceExpiry?: string;
  taxTokenExpiry?: string;
}

export function DocumentExpiryAlert({ fitnessExpiry, insuranceExpiry, taxTokenExpiry }: DocumentExpiryAlertProps) {
  const today = dayjs();
  const daysThreshold = 30;
  
  const expiringDocs = [];
  
  if (fitnessExpiry && dayjs(fitnessExpiry).diff(today, "days") < daysThreshold) {
    expiringDocs.push({ name: "Fitness", date: fitnessExpiry });
  }
  if (insuranceExpiry && dayjs(insuranceExpiry).diff(today, "days") < daysThreshold) {
    expiringDocs.push({ name: "Insurance", date: insuranceExpiry });
  }
  if (taxTokenExpiry && dayjs(taxTokenExpiry).diff(today, "days") < daysThreshold) {
    expiringDocs.push({ name: "Tax Token", date: taxTokenExpiry });
  }

  if (expiringDocs.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <Tag color="orange" icon={<FiAlertCircle />}>
        {expiringDocs.length} Doc{expiringDocs.length > 1 ? "s" : ""} Expiring
      </Tag>
    </div>
  );
}


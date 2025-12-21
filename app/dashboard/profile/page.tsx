"use client";

import { Avatar, Button, Card, Descriptions, Form, Input, Select, Space, Spin, Tag } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiEdit, FiInfo, FiLock, FiSave, FiShield, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import { FormLoader } from "../components/Loader";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [form] = Form.useForm();

  // Watch role to conditionally show/require company
  const role = Form.useWatch("role", form);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "loading" || !session?.user?.id) return;

      try {
        const [userRes, companiesRes] = await Promise.all([
          fetch(`/api/users/${session.user.id}`),
          fetch("/api/companies"),
        ]);

        if (!userRes.ok) throw new Error("User not found");

        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(
            companiesData.map((c: any) => ({ label: c.name, value: c._id }))
          );
        }

        const user = await userRes.json();
        setUserData(user);
        const { password, ...formData } = user;
        form.setFieldsValue(formData);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [session, status, form]);

  const handleFinish = async (values: any) => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      // Don't send empty password
      if (!values.password) {
        delete values.password;
      }

      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUserData(updatedUser);
      
      // Update session if name or email changed
      if (values.name || values.email) {
        await update();
      }

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      const { password, ...formData } = userData;
      form.setFieldsValue(formData);
    }
    setEditing(false);
  };

  if (status === "loading" || fetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div style={{ textAlign: "center", padding: "48px" }}>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  const userInitials = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : session.user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-1 text-slate-500">
          Manage your account information and preferences.
        </p>
      </div>

      <FormLoader loading={fetching}>
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Header Card */}
          <Card className="rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <Avatar
                size={120}
                src={userData?.image || session.user.image}
                style={{
                  background: "#e0e7ff",
                  color: "#4f46e5",
                  border: "4px solid #fff",
                  boxShadow: "0 0 0 1px #e2e8f0",
                  fontSize: 48,
                  fontWeight: 600,
                }}
              >
                {userInitials}
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userData?.name || session.user.name}
                </h2>
                <p className="mt-1 text-slate-500">{userData?.email || session.user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  {userData?.role && (
                    <Tag
                      color={
                        userData.role === "Admin"
                          ? "red"
                          : userData.role === "Operator"
                          ? "blue"
                          : "default"
                      }
                      style={{ fontSize: 13, padding: "4px 12px" }}
                    >
                      {userData.role}
                    </Tag>
                  )}
                  {userData?.emailVerified && (
                    <Tag color="green" style={{ fontSize: 13, padding: "4px 12px" }}>
                      Email Verified
                    </Tag>
                  )}
                </div>
              </div>
              <div>
                {!editing ? (
                  <Button
                    type="primary"
                    icon={<FiEdit />}
                    onClick={() => setEditing(true)}
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      border: "none",
                      boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Space>
                    <Button onClick={handleCancel} size="large">
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => form.submit()}
                      loading={loading}
                      icon={<FiSave />}
                      size="large"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        border: "none",
                        boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
                      }}
                    >
                      Save Changes
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card
            className="rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
            title={
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FiUser className="text-indigo-500" /> Account Information
              </div>
            }
          >
            {editing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark="optional"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Form.Item
                      name="name"
                      label={
                        <span className="font-medium text-slate-600">Full Name</span>
                      }
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Input
                        placeholder="e.g. John Doe"
                        size="large"
                        className="rounded-lg"
                        prefix={<FiUser />}
                      />
                    </Form.Item>
                  </div>
                  <div className="md:col-span-2">
                    <Form.Item
                      name="email"
                      label={
                        <span className="font-medium text-slate-600">
                          Email Address
                        </span>
                      }
                      rules={[
                        { required: true, message: "Required" },
                        { type: "email", message: "Invalid email" },
                      ]}
                    >
                      <Input
                        placeholder="john@example.com"
                        size="large"
                        className="rounded-lg"
                        prefix={<FiInfo />}
                      />
                    </Form.Item>
                  </div>
                  <div className="md:col-span-2">
                    <Form.Item
                      name="password"
                      label={
                        <span className="font-medium text-slate-600">
                          New Password (Optional)
                        </span>
                      }
                    >
                      <Input.Password
                        placeholder="Leave blank to keep current"
                        size="large"
                        className="rounded-lg"
                        prefix={<FiLock />}
                      />
                    </Form.Item>
                  </div>
                  <div className="md:col-span-2">
                    <Form.Item
                      name="image"
                      label={
                        <span className="font-medium text-slate-600">
                          Profile Image URL (Optional)
                        </span>
                      }
                    >
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            ) : (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Full Name">
                  {userData?.name || session.user.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {userData?.email || session.user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Profile Image">
                  {userData?.image ? (
                    <a href={userData.image} target="_blank" rel="noopener noreferrer">
                      {userData.image}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>

          {/* Role & Permissions */}
          {userData && (
            <Card
              className="rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              title={
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FiShield className="text-indigo-500" /> Role & Permissions
                </div>
              }
            >
              {editing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFinish}
                  requiredMark="optional"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Form.Item
                        name="role"
                        label={<span className="font-medium text-slate-600">Role</span>}
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Select size="large" className="rounded-lg">
                          <Select.Option value="Admin">Admin</Select.Option>
                          <Select.Option value="Operator">Operator</Select.Option>
                          <Select.Option value="User">User</Select.Option>
                          <Select.Option value="Counterman">Counterman</Select.Option>
                          <Select.Option value="Agent">Agent</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    {/* Show Company selection only for Operator or User roles */}
                    {(role === "Operator" || role === "User") && (
                      <div className="md:col-span-2">
                        <Form.Item
                          name="company"
                          label={
                            <span className="font-medium text-slate-600">
                              Assigned Company
                            </span>
                          }
                          rules={[
                            {
                              required: role === "Operator",
                              message: "Required for Operators",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            placeholder="Select a company"
                            className="rounded-lg"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={companies}
                          />
                        </Form.Item>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <Form.Item
                        name="permissions"
                        label={
                          <span className="font-medium text-slate-600">
                            Permissions
                          </span>
                        }
                      >
                        <Select
                          mode="tags"
                          size="large"
                          placeholder="Select permissions"
                          className="rounded-lg"
                          options={[
                            { value: "manage_users", label: "Manage Users" },
                            { value: "manage_companies", label: "Manage Companies" },
                            { value: "view_reports", label: "View Reports" },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Role">
                    <Tag
                      color={
                        userData.role === "Admin"
                          ? "red"
                          : userData.role === "Operator"
                          ? "blue"
                          : "default"
                      }
                    >
                      {userData.role}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Company">
                    {userData.company?.name || "Not assigned"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Permissions">
                    {userData.permissions && userData.permissions.length > 0 ? (
                      <Space wrap>
                        {userData.permissions.map((perm: string) => (
                          <Tag key={perm}>{perm}</Tag>
                        ))}
                      </Space>
                    ) : (
                      "No special permissions"
                    )}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          )}

          {/* Account Details */}
          {userData && (
            <Card
              className="rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              title={
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FiInfo className="text-indigo-500" /> Account Details
                </div>
              }
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="User ID">
                  {userData._id}
                </Descriptions.Item>
                <Descriptions.Item label="Email Verified">
                  {userData.emailVerified ? (
                    <Tag color="green">
                      Yes - {new Date(userData.emailVerified).toLocaleDateString()}
                    </Tag>
                  ) : (
                    <Tag color="orange">Not verified</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Account Created">
                  {new Date(userData.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(userData.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </div>
      </FormLoader>
    </div>
  );
}


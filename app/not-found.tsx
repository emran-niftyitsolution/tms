"use client";

import { Button, Result } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <div className="flex gap-4 justify-center">
            <Button type="primary" onClick={() => router.back()}>
              Go Back
            </Button>
            <Link href="/dashboard">
              <Button type="primary">Back Home</Button>
            </Link>
          </div>
        }
      />
    </div>
  );
}


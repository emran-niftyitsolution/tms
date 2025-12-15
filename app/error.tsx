"use client";

import { Button, Result } from "antd";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <div className="flex gap-4 justify-center">
            <Button type="primary" onClick={reset}>
              Try Again
            </Button>
            <Button onClick={() => router.back()}>Go Back</Button>
            <Link href="/dashboard">
              <Button type="primary">Back Home</Button>
            </Link>
          </div>
        }
      />
    </div>
  );
}




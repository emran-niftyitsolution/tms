import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-12 dark:bg-black sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              TMS Tickets
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side - Image/Banner */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-slate-900">
          <Image
            className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel background"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-20 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              Start your journey <br />
              with confidence.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Join thousands of travelers who book their trips seamlessly with TMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


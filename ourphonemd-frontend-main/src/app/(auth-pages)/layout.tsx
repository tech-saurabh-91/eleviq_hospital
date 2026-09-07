import AuthHeader from "@/components/layout/auth/AuthHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHeader />
      <main className="my-16 min-h-screen max-w-7xl mx-auto">
        {children}
      </main>
    </>
  );
}
  
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function BookPage() {
  const router = useRouter();
  const { user, isLoadingUser } = useUser();

  useEffect(() => {
    if (isLoadingUser) return;

    if (user) {
      router.replace("/patient/appointments/new");
    } else {
      router.replace("/signin");
    }
  }, [user, isLoadingUser, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <p className="text-lg text-slate-600">
        Checking your account...
      </p>
    </div>
  );
}
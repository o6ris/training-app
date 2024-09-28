"use client";

import Signup from "components/Signup/Signup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to home or another route
    }
  }, [status, router]);

  
  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Signup />
      </main>
    );
  }
}

"use client";

import classes from "./pageSignup.module.css"
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
      <main className={classes.signup_wrapper}>
        <Signup />
      </main>
    );
  }
}

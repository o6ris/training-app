"use client";

import classes from "./pageLogin.module.css";
import Login from "components/Login/Login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.first_connexion) {
        router.push("/create-profile");
      } else {
        router.push("/");
      }
    }
  }, [status, router, session]);

  if (status === "unauthenticated") {
    return (
      <main className={classes.login_wrapper}>
        <Login />
      </main>
    );
  }
}

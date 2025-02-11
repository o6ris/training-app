"use client";

import classes from "./header.module.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";

function Header({ session }) {
  return (
    <header className={classes.header}>
      <Image
        src="/logo-white.svg"
        alt="GrindPal Logo"
        width={150}
        height={150}
        priority
      />
      <div className={classes.button_wrapper}>
        {session ? (
          <Button
            className={classes.link}
            onPress={() => signOut({ callbackUrl: "/home" })}
          >
            Logout
          </Button>
        ) : (
          <>
            <Link className={classes.link} href={"/login"}>
              Login
            </Link>
            <Link className={classes.link} href={"/signup"}>
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

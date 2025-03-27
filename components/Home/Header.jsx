"use client";

import classes from "./header.module.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

function Header({ session }) {
  const pathname = usePathname();

  return (
    <header className={classes.header}>
      <Link href={"/"}>
        <Image
          src={pathname.includes("home") ? "/logo-white.svg" : "/logo.svg"}
          alt="GrindPal Logo"
          width={150}
          height={150}
          priority
        />
      </Link>
      <div className={classes.button_wrapper}>
        {session ? (
          <Button
            className={classes.link}
            style={{ color: pathname.includes("home") ? "" : "#02091c" }}
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
